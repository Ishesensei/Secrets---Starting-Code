app
  .route('/register')
  .get((req, res) => {
    colorTags.httpReq();
    res.render('register');
  })
  .post(async (req, res) => {
    colorTags.httpReq();
    let { email, password } = req.body;
    const username = email;
    await User.register(
      { username: username },
      password,
      async function (err, user) {
        if (err) {
          console.log(err.message);
          res.send(err.message);
          //res.redirect('/register');
        } else {
          colorTags.log('User Registered');
          await passport.authenticate('local', {
            successRedirect: '/secrets',
            failureRedirect: '/register',
            failureFlash: true,
          });
          res.redirect('/login');
        }
      }
    );
  });
