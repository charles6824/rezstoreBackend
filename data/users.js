import bcrypt from 'bcryptjs'

const users = [
    {
      name: 'Rez Store Admin',
      email: 'admin@rezstore.com',
      password: bcrypt.hashSync('rezstore', 10),
      isAdmin: true
    },
    {
        name: 'Test Account',
        email: 'test@example.com',
        password: bcrypt.hashSync('123456', 10),
    }
  ]
  
  export default users
  