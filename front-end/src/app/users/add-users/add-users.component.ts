import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { RegistrationService } from 'src/app/user/services/registration.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit {
  user: User = new User();
  errorVal = '';

  constructor(public registrationService: RegistrationService, private router: Router,private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  addUser() {
    this.registrationService.regUser(this.user).subscribe(data => {
      this.user = data;
      this.router.navigate(['home', { outlets: { nav: ['users'] } }]);
    },error=>{
      this.errorVal = "Please fill all the fields";
    });
  }
}
