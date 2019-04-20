function addSubject(evt){
    //xhr request to display the add subject form 
    const req = new XMLHttpRequest();
    const name = document.querySelector('#new-subject').value;

    req.open('POST', '/addsubject');

    //add code for using body
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    req.addEventListener('load', function(){
        if(req.status>=200 && req.status<400){
            //add new subject to page 
            //use Vue
        }

        else{
            console.log("error in adding the subject");
        }
        
    });

    req.addEventListener('error', function(){
        console.log('could not add new subject')
    });

    req.send('subject='+name);

    cancelClicked();

}

function addFact(evt){
    //xhr request to display the add subject form 
    const req = new XMLHttpRequest();
    const fact = document.querySelector('#new-fact').value;

    req.open('POST', '/addfact');

    //add code for using body
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


    req.addEventListener('load', function(){
        if(req.status>=200 && req.status<400){
            //add new subject to page 
            //use Vue

        }

        else{
            console.log("error in adding fact");
        }
        
    });

    req.addEventListener('error', function(){
        console.log('could not add new fact')
    });

    req.send('fact='+fact);

    cancelClicked();
}

function cancelClicked(evt){
    document.querySelector('.modal').style.display = 'none';
        
}


function showModal(evt){

    document.querySelector('.modal').style.display = 'unset';


    if(document.querySelector('#create-subject')){
    const button = document.querySelector('#create-subject');
    button.addEventListener('click', addSubject);
    }

    else{
        document.querySelector('#create-fact').addEventListener('click', addFact);
    }

    document.querySelector('#cancel').addEventListener('click', cancelClicked);
}


function main(){

    if(document.querySelector('#add-subject')){
        const button = document.querySelector('#add-subject');
        button.addEventListener('click', showModal);
    }

    if(document.querySelector('#add-fact')){
        const button = document.querySelector('#add-fact');
        button.addEventListener('click', showModal);
    }


}

document.addEventListener("DOMContentLoaded", main);