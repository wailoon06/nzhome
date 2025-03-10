Users Controllers
1. Register (Done)
    Successfully registered will automatically assign as user, with no family

2. Login (Done)
    Successfully login user will be given a token (15 minutes)

3. Change Password (Done)
    User needs to in log in status to change password

4. Get User Details (Done)
    Get username, email address, and role, for display purpose


Family Controllers
1. Create Fam 
    Role: Owner, SuperAdmin
    Owner needs to enter a special code that match with famPass only can create a family
    DTO: Familyname, Family Password

2. Add User Fam
    Role: Admin, Owner
    Add user into family by adding their email address

3. Delete User Fam
    Role: Admin, Owner
    Delete user from family

4. Get Users
    Role: All
    Get all users in a family, including username, email address and Role 

5. Change an user's role in a family
    Role: Owner
    User -> Admin
    Admin -> User

    Role: SuperAdmin
    User -> Owner
    Owner -> User