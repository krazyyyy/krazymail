document.addEventListener('DOMContentLoaded', function() {
  
  var inbox = document.querySelector('#inbox')
  // Use buttons to toggle between views
  inbox.addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  send_mail()
  // By default, load the inbox
  load_mailbox('inbox');

  bar = document.getElementById('bars')
  navbar = document.getElementById('navbar')
  bar.addEventListener('click', ()=>{
  navbar.classList.toggle('active-bar')
  bar.classList.toggle('active-bars')
})

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
 


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  

    
  } 



function send_mail() {
  const form = document.querySelector("#compose-form")
  const msg = document.querySelector("#message");
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    body = document.querySelector('#compose-body')
    to = document.querySelector('#compose-recipients')
    subject = document.querySelector('#compose-subject')
    if (form.length == 0 && to.length == 0) return;
  fetch("/emails", {
    method:'POST',
    body : JSON.stringify ({
      recipients : to.value,
      subject : subject.value,
      body : body.value,
    }),
  }) 

  .then((response) => response.json())
  .then((result) => {
    console.log(result);
    if(result['message'] == "Email sent successfully.") {
      load_mailbox("sent")
    }
    else{
      msg.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">${result.error}</div>`;
    }
  });
}
)
false
};

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'revert';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then((response) => response.json())
  .then((mails) =>{
      mails.forEach(mail =>{
        
        let add = document.createElement('tr')
        if (mail.read == true){
          add.className = "unread"
        }
        add.innerHTML = `
        <td class="inbox-small-cells>
        <input type="checkbox" class="mail-checkbox">
        </td>
        <td onclick="colorToggle" class="inbox-small-cells"><i class="fa fa-star"></i>
        </td>
        <td class="view-message dont-show"> ${mail.subject} </td>
        <td class="view-message"> ${mail.body.slice(0, 50)}</td>
        <td>&nbsp;<td>
        <td class="view-message text-right">${mail.timestamp}</td>
         `
        document.querySelector("#emails-view").appendChild(add)
        add.addEventListener('click',() => mail_view(mailbox,`${mail.id}`))
        
      
      })
  })
}

function mail_view(mailbox, mail_id){
  email_view = document.querySelector('#emails-view')
  fetch(`/emails/${mail_id}`)
  .then(response => response.json())
  .then(mail =>{
    document.querySelector("#emails-view").innerHTML = "";
    let mail_items = document.createElement('div');
    mail_items.className = 'inbox-body';
    
    mail_items.innerHTML = `<div class="inbox-view">
    <div class="col-md-8">
      <div class="reply-btn">
        <button class="btn btn-sm btn-primary reply-button"><i class="fa fa-reply"> Reply</i></button>
        <button class="btn btn-sm btn-primary archive-button"><i class="fa fa-reply"> </i></button>
      </div>
    </div>
    <div class="col-md-12">
    <p><strong>From</strong> : ${mail.sender}</p>
    <p><strong>To</strong> : ${mail.recipients}</p>
    <p><strong>Subjet</strong> : ${mail.subject}</p>
    <p><strong>Time</strong> : ${mail.timestamp}</p>
    </div>
    <hr>
    ${mail.body} </div>`
    
    email_view.appendChild(mail_items)

    reply = document.querySelector('.reply-button')
    reply.addEventListener('click', () => {reply_mail(mail.sender, mail.subject, mail.body, mail.timestamp)})


    archive = document.querySelector('.archive-button')
    if (mail.archived == true){
      archive.innerHTML = "Unarchive";
    }
    else
    {
      archive.innerHTML = "Archive"
    }  
    archive.addEventListener("click", () => {
      archive_mail(mail.id, mail.archived)
      
    });

    fetch(`/emails/${mail_id}`, {
      method : "PUT",
      body : JSON.stringify({
        read : true,
      }),
    });

  })
}

function archive_mail(id, arch){
  fetch(`emails/${id}`,{
    method : 'PUT',
    body : JSON.stringify({
      archived : !arch,
    }),
  });
  load_mailbox('archive')
} 
  
function reply_mail(sender, subject, body, timestamp){
  compose_email()
  if (!/^Re:/.test(subject)){
     subject = `Re: ${subject}`;
  }
  document.querySelector("#compose-recipients").value = sender;
  document.querySelector("#compose-subject").value = subject;

  pre_fill = `On ${timestamp} ${sender} wrote:\n""${body}""\n`;

  document.querySelector("#compose-body").value = pre_fill;
}

function search() {
  // Declare variables
  var input, filter, ul, tr, a, i, txtValue;
  input = document.getElementById('inp');
  filter = input.value.toUpperCase();
  ul = document.getElementById("emails-view");
  tr = ul.getElementsByTagName('tr');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    a = tr[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}



