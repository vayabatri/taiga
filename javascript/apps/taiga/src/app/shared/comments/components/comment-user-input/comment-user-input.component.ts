/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2023-present Kaleidos INC
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Output,
  inject,
} from '@angular/core';
import { UserAvatarComponent } from '~/app/shared/user-avatar/user-avatar.component';
import { Store } from '@ngrx/store';
import { selectUser } from '~/app/modules/auth/data-access/+state/selectors/auth.selectors';
import { filterNil } from '~/app/shared/utils/operators';
import { RxState } from '@rx-angular/state';
import { User } from '@taiga/data';
import { EditorComponent } from '~/app/shared/editor/editor.component';
import { CommonTemplateModule } from '~/app/shared/common-template.module';
import { DiscardChangesModalComponent } from '~/app/shared/discard-changes-modal/discard-changes-modal.component';
import { ComponentCanDeactivate } from '~/app/shared/can-deactivate/can-deactivate.guard';
import { CanDeactivateService } from '~/app/shared/can-deactivate/can-deactivate.service';
import { Subject, delay, map, of, take } from 'rxjs';

interface CommentUserInputComponentState {
  user: User;
  open: boolean;
  editorReady: boolean;
  comment: string;
  showConfirmationModal: boolean;
}

@Component({
  selector: 'tg-comment-user-input',
  standalone: true,
  imports: [
    CommonTemplateModule,
    UserAvatarComponent,
    EditorComponent,
    DiscardChangesModalComponent,
  ],
  templateUrl: './comment-user-input.component.html',
  styleUrls: ['./comment-user-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class CommentUserInputComponent implements ComponentCanDeactivate {
  @Output()
  public saved = new EventEmitter<string>();

  @HostListener('window:beforeunload')
  public beforeunload() {
    return !this.hasChanges();
  }

  public store = inject(Store);
  public state = inject(RxState) as RxState<CommentUserInputComponentState>;
  public model$ = this.state.select();
  public discard$ = new Subject<boolean>();

  constructor() {
    this.reset();

    this.state.connect('user', this.store.select(selectUser).pipe(filterNil()));

    const canDeactivateService = inject(CanDeactivateService);
    canDeactivateService.addComponent(this);

    this.state.hold(this.discard$, (discard) => {
      if (discard) {
        this.discard();
      } else {
        this.keepEditing();
      }
    });
  }

  public canDeactivate() {
    if (this.hasChanges()) {
      this.state.set({ showConfirmationModal: true });

      return this.discard$.pipe(take(1));
    }

    return of(true);
  }

  public open() {
    this.state.set({
      comment: '',
      editorReady: false,
      showConfirmationModal: false,
      open: true,
    });
  }

  public cancel() {
    if (this.hasChanges()) {
      this.state.set({ showConfirmationModal: true });
      return false;
    }

    this.state.set({ open: false, editorReady: false });
    return true;
  }

  public onCommentContentChange(comment: string) {
    this.state.set({ comment });
  }

  public onInitEditor() {
    this.state.set({ editorReady: true });
  }

  public hasChanges() {
    return this.state.get('comment').trim().length > 0;
  }

  public save() {
    this.saved.emit(this.state.get('comment'));
    this.reset();
  }

  private discard() {
    this.state.set({ showConfirmationModal: false, open: false });
  }

  private keepEditing() {
    this.state.set({ showConfirmationModal: false });
  }

  private reset() {
    this.state.set({
      comment: '',
      editorReady: false,
      showConfirmationModal: false,
      open: false,
    });
  }
}
