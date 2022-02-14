/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map, switchMap, tap } from 'rxjs/operators';
import { zip } from 'rxjs';

import * as NewProjectActions from '~/app/modules/feature-new-project/+state/actions/new-project.actions';
import { ProjectApiService } from '@taiga/api';
import { pessimisticUpdate } from '@nrwl/angular';
import { Project } from '@taiga/data';
import { Router } from '@angular/router';
import { AppService } from '~/app/services/app.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class NewProjectEffects {
  public createProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NewProjectActions.createProject),
      pessimisticUpdate({
        run: (action) => {
          return this.projectApiService.createProject(action.project).pipe(
            map((project: Project) => {
              return NewProjectActions.createProjectSuccess({ project });
            })
          );
        },
        onError: (_, httpResponse: HttpErrorResponse) => {
          NewProjectActions.createProjectError({ error: httpResponse });
          return this.appService.toastError(httpResponse, {
            label: 'errors.create_project',
            message: 'errors.please_refresh',
          });
        },
      })
    );
  });

  public createProjectSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(ofType(NewProjectActions.createProject)).pipe(
        switchMap(() => {
          return zip(
            this.actions$.pipe(ofType(NewProjectActions.createProjectSuccess)),
            this.actions$.pipe(ofType(NewProjectActions.inviteUsersNewProject))
          ).pipe(
            tap(([action]) => {
              void this.router.navigate([
                '/project/',
                action.project.slug,
                'kanban',
              ]);
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private projectApiService: ProjectApiService,
    private router: Router,
    private appService: AppService
  ) {}
}
