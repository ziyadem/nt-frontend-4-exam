console.log(123);
let load=document.querySelector(".load"),
    elForm=document.querySelector("form"),
    elInputEmail=document.querySelector(".email"),
    elInputPassword=document.querySelector(".password"),
    fogotPasword=document.querySelector(".fogotPasword");

console.log(load,elForm,elInputEmail,elInputPassword,fogotPasword);


setTimeout(() => {
    load.style.display="none";
}, 1000);
fogotPasword.addEventListener('click',()=>{
    elInputEmail.value="eve.holt@reqres.in";
    elInputPassword.value="cityslicka";
})

let getToken=localStorage.getItem('token');
if(getToken){
    window.location.replace('./index.html');
}

elForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    fetch("https://reqres.in/api/login",{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            email:elInputEmail.value,
            password:elInputPassword.value,
        }),
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.token){
            localStorage.setItem('token',data.token);
            window.location.replace('./index.html');
        }
    })
    .catch((err)=>alert(err));
});

