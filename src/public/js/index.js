/*function createAccount(evt){
    //make xhr request 
    const req = new XMLHttpRequest();
    const url = '/new-account';
    req.open('POST', url);

    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    req.addEventListener('load', function(){
        if(req.status >=200 && req.status<400){
            console.log('in here');
        }

    });

    req.addEventListener('error', function(){
        
    });

    req.send();
}
*/



function cancelModal(evt){

    if(document.querySelector('.modal')===null){
        document.querySelector('.modal2').style.display = 'none';
        return;
    }
    document.querySelector('.modal').style.display = 'none';
    
}

function createAccountForm(evt){
    //this functions displays the modal for creating an account 
    document.querySelector('.modal').style.display = 'unset';
}


function main(){

    //add event listener for button to create account 
    const btn1 = document.querySelector("#create-account");
    
    btn1.addEventListener('click', createAccountForm);


     //event listener for cancel button in modal 
     const cancel = document.querySelector('#cancel-modal');
     cancel.addEventListener('click', cancelModal);

}

document.addEventListener("DOMContentLoaded", main);