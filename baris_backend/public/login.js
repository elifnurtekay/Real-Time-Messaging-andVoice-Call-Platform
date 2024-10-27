document.addEventListener('DOMContentLoaded', () => {

	const signUpButton = document.getElementById('signUp');
	const signInButton = document.getElementById('signIn');
	const container = document.getElementById('container');
	const createAccountButton = document.getElementById('createAccount');
	const form = document.getElementById('loginForm');

	signUpButton.addEventListener('click', () => {
		container.classList.add("right-panel-active");
	});
	
	signInButton.addEventListener('click', () => {
		container.classList.remove("right-panel-active");
	});	

	createAccountButton.addEventListener('click', async(event) => {
		const form = document.getElementById('registerForm');
		event.preventDefault();

		const formData = new FormData(form);
    	const data = {
        	name: formData.get('name'),
        	surname: formData.get('surname'),
        	username: formData.get('username'),
        	password: formData.get('password'),
        	email: formData.get('email'),
        	about: formData.get('about') ? formData.get('about').trim() : null // Null kontrolü ekle
    	};

		console.log('Gönderilen veri:', data); // Veriyi konsola yazdır

		try {
			const response = await fetch('api/users/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
		
			if (!response.ok) {
				const errorData = await response.json(); // Hata yanıtını JSON olarak alıyoruz
				console.log('Hata verisi:', errorData);
				alert(errorData.message || 'Bir hata oluştu.'); // Hata mesajını göster
				return; // Eğer hata varsa işlem burada sonlandırılıyor
			}
				
			const result = await response.json();
			alert(result.message || 'Kayıt işlemi başarılı')
	
		} catch (error) {
			console.error('Kayıt hatası:', error);
			alert('Kayıt sırasında hata oluştu.');
		}
	});

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const formData = new FormData(form);
		const data_ = {
			username: formData.get('username_') ? formData.get('username_').trim() : null,
      		password: formData.get('password_') ? formData.get('password_').trim() : null
		};

		console.log(data_)
	  
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data_),
		  	});
	  
			const data = await response.json();
	  
		  if (response.ok) {
			alert("Giriş başarılı, hoş geldiniz.")
			const response2 = await fetch('/anasayfa', {
				method: 'GET',
				headers: { 'Authorization': `${data.token}` },
		  	});

			const data2 = await response2.text();
			if(response2.ok){
				
				window.location.href = "/anasayfa"
			}else{
				
				console.log(data2)
				
			}
			
		  } else {
			alert(data.message);
		  }
		} catch (error) {
		  console.error("Giriş başarısız:", error);
		  alert("Giriş işlemi başarısız oldu, lütfen tekrar deneyin.");
		}
	  });
	  

});
