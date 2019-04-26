
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
            const response = JSON.parse(req.responseText);

            const toadd = document.createElement('a');
            toadd.className = 'sub-link';
            toadd.href = '/'+response.slug;
            const div = document.createElement('div');
            div.className = 'subject-box';
            const li = document.createElement('li');
            li.textContent = response.name;
            div.appendChild(li);
            
            toadd.appendChild(div);

            $('#user-subject-list').append(toadd);
            
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
    const subj = $('#subject').val();

    req.open('POST', '/addfact');

    //add code for using body
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


    req.addEventListener('load', function(){
        if(req.status>=200 && req.status<400){
            //add new fact to page 
            const response = JSON.parse(req.responseText);

            

            const div = document.createElement('div');
            div.className = 'fact-box fact-score';


            const li = document.createElement('li');
            li.textContent = response.info;
            li.className = 'info-text';

            const lidiv = document.createElement('div');
            lidiv.className = 'fact-info';
            lidiv.appendChild(li);

            const scorediv = document.createElement('div');
            scorediv.className = 'score';
            scorediv.id = response['_id'];

            //add score to the score div
            scorediv.textContent = response.score;

            
            div.appendChild(lidiv);
            div.appendChild(scorediv);

            div.addEventListener('click', showSecondModal);

            $('#fact-list').append(div);

            
        }

        else{
            console.log("error in adding fact");
        }
        
    });

    req.addEventListener('error', function(){
        console.log('could not add new fact')
    });

    //add subject name to send to the server
    req.send('fact='+fact+'&subject='+subj);

    cancelClicked();
}

function cancelClicked(evt){
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('#new-fact').value = '';

    document.querySelector('.modal2').style.display = 'none';
    
    document.querySelector('.modal3').style.display = 'none';
        
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

function showSecondModal(evt){
    document.querySelector('.modal2').style.display = 'unset';

    document.querySelector('#cancel2').addEventListener('click', cancelClicked);

    document.querySelector('#clicked-fact').value = this.querySelector('.info-text').textContent;

}

function showFilterModal(evt){
    document.querySelector('.modal3').style.display = 'unset';

    document.querySelector('#cancel3').addEventListener('click', cancelClicked);
}


function main(){

    if(document.querySelector('#add-subject')){
        const button = document.querySelector('#add-subject');
        button.addEventListener('click', showModal);


        $('#show-site-list').click(function(){
            $('#user-list').hide();
            $('#site-list').show();
        });

        $('#show-user-list').click(function(){
            $('#user-list').show();
            $('#site-list').hide();
        });


    }

    if(document.querySelector('#add-fact')){
        const button = document.querySelector('#add-fact');
        button.addEventListener('click', showModal);

       const btns = $('.fact-score');
       for(let i=0; i<btns.length; i++){
           btns[i].addEventListener('click', showSecondModal);
       }

       //add event listener for filter
       $('#filter-button').click(showFilterModal);


       //add event listener to filter
       $('#filter-btn').click(function(){
        cancelClicked();
        const num = parseInt($('#filter-value').val());
        const subject = document.querySelector('#subject-name').textContent;
       // $.post('/facts',{number:num, subject: subject});

        let facts = document.querySelector('#fact-list').childNodes;
        facts = Array.from(facts);

        const filtering = facts.filter(function(ele){
            if(ele.nodeType === 1){
                console.log('ele is ', ele);
                console.log('ele child nodes are ', ele.childNodes);

                const check = parseInt(ele.querySelector('.score').textContent);
                if (check < num){
                    ele.style.display = 'none';
                }
                else{
                    return ele;
                }
            }
        });


    });

     //add eventlistener to add score
     $('#add-score').click(function(){
        cancelClicked();
        const num = $('#new-fact-score').val();
        const fact = $('#clicked-fact').val();
        const subject = document.querySelector('#subject-name').textContent;

        console.log('num is ', num, ' fact is ', fact, ' subject ',subject);
        $.post('/updatescore',{score: num, fact:fact, subject:subject}, function(data){
            const id = '#'+data.update['_id'];
           //document.querySelector(id).querySelector('.score').textContent = data.update.score;
           console.log(data.update['_id']);
           console.log($(id));
           $(id).text(data.update.score);
        });
    });

    }


}

$(document).ready(main);