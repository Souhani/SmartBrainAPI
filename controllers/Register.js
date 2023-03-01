const handleRegister = (postg, bcrypt) => (req, res) => {


	const {email, password, name} = req.body;
    if(!email || !name || !password){
    	return res.status(400).json('incorrect form submission');
    };
    const hash = bcrypt.hashSync(password);

	postg.transaction(trx =>{
		  trx.insert({
				email: email,
				hash: hash
			})
		  .into('login')
		  .returning('email')
		  .then(loginEmail=>{

		        return trx('users')
				       .returning('*')
					   .insert({
					   	email: loginEmail[0].email,
					   	name: name,
					    joined: new Date()
					})
					   .then(user =>{
					   	res.json(user[0]);
					   })

			})
		  .then(trx.commit)
		  .catch(trx.rollback)

   })    
   .catch(err => res.status(400).json("unable to register"))

   
};

module.exports = {
  handleRegister: handleRegister
};