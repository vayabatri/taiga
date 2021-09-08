/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ProjectEffects } from './project.effects';

describe('ProjectEffects', () => {
  let actions$: Observable<Action>;
  let spectator: SpectatorService<ProjectEffects>;

  const createService = createServiceFactory({
    service: ProjectEffects,
    providers: [
      provideMockActions(() => actions$)
    ],
    mocks: []
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.effects).toBeTruthy();
  });
});
