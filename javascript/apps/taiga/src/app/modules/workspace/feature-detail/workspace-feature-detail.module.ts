/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core';
import { AvatarModule } from '@taiga/ui/avatar';
import { SkeletonsModule } from '@taiga/ui/skeletons/skeletons.module';
import { BadgeModule } from 'libs/ui/src/lib/badge/badge.module';
import { CapitalizePipeModule } from '~/app/shared/pipes/capitalize/capitalize.pipe.module';
import { ProjectCardComponent } from '~/app/shared/project-card/project-card.component';
import { ResizeEventModule } from '~/app/shared/resize/resize.module';
import { TitleDirective } from '~/app/shared/title/title.directive';
import { WorkspaceDetailEffects } from './+state/effects/workspace-detail.effects';
import { workspaceDetailFeature } from './+state/reducers/workspace-detail.reducer';
import { WorkspaceDetailSkeletonComponent } from './components/workspace-detail-skeleton/workspace-detail-skeleton.component';
import { WorkspaceDetailComponent } from './components/workspace-detail/workspace-detail.component';
import { WorkspacePageRoutingModule } from './workspace-feature-detail-routing.module';

@NgModule({
  declarations: [WorkspaceDetailComponent, WorkspaceDetailSkeletonComponent],
  imports: [
    TitleDirective,
    CommonModule,
    TuiButtonModule,
    TuiLinkModule,
    RouterModule,
    AvatarModule,
    TranslocoModule,
    BadgeModule,
    StoreModule.forFeature(workspaceDetailFeature),
    EffectsModule.forFeature([WorkspaceDetailEffects]),
    ProjectCardComponent,
    ResizeEventModule,
    WorkspacePageRoutingModule,
    SkeletonsModule,
    CapitalizePipeModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'workspace' }],
})
export class WorkspaceFeatureDetailModule {}
