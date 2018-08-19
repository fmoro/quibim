import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Input() user: User;
  file: File;
  image: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.downloadImage();
  }

  getUser(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService.getUser(id)
      .subscribe(user => this.user = user);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.userService.updateUser(this.user)
      .subscribe(() => this.goBack());
  }

  selectFile(event) {
    this.file = event.target.files[0];
  }

  downloadImage() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService.downloadUserImage(id)
      .subscribe(data => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.image = reader.result;
        }, false);
        reader.readAsDataURL(data);
      });
  }

  uploadImage() {
    this.userService.uploadUserImage(this.user._id, this.file)
      .subscribe(user => {
        this.user = user;
        this.ngOnInit();

        return this.user;
      });
  }
}
