
let load=document.querySelector(".load"),
    elInput=document.querySelector("input"),
    elForm=document.querySelector("form"),
    rigthPoginationBtn=document.querySelector(".right"),
    poginationBtn=document.querySelectorAll(".poginationBTN"),
    pogination=document.querySelector(".pogination"),
    leftPoginationBtn=document.querySelector(".left"),
    elSaveds=document.querySelector(".saveds"),
    offcanvasBody=document.querySelector(".offcanvas-body"),
    cardBody=document.querySelector(".bookBody"),
    logOut=document.querySelector("#logout"),
    newest=document.querySelector("#newest"),
    newestP=document.querySelector(".newestP");

// relevance and newest

let key='newest';
newest.addEventListener("click",()=>{
    if(newest.getAttribute("class")==='order'){
        newest.removeAttribute("class");
        key="relevance";
        newestP.textContent="relevance";
    }else{
        newest.setAttribute("class","order");
        key='newest';
        newestP.textContent="newest";
    }
});

// logout

logOut.addEventListener("click",()=>{
    localStorage.removeItem("token");
    window.location.reload();
})

let getToken=localStorage.getItem('token');
if(!getToken){
    window.location.replace('./login.html');
}

// loader

setTimeout(() => {
    load.style.display="none";
}, 1000);

// search

elForm.addEventListener("input",(e)=>{
    e.preventDefault();
    pogination.style.display = "block";
    cardBody.style.background = "#E5E5E5";
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${elInput.value}&startIndex=1&maxResults=6&orderBy=${key}`)
    .then(response => response.json())
    .then(json => sartirofka(json.totalItems,json.items)) 
    .catch((err)=>console.log(err));
    
});

// pogination

rigthPoginationBtn.addEventListener("click",()=>{
    leftPoginationBtn.disabled = false;
    leftPoginationBtn.classList.add("disablet");
    for( i of poginationBtn){
        let arr=Number(i.textContent)+10;
        i.innerHTML=arr;
    }    
});
if(leftPoginationBtn.disabled){
    leftPoginationBtn.addEventListener("click",()=>{
        let btn1=document.querySelector("#btn1");
        let btn1Value=Number(btn1.textContent);
        if (btn1Value==11) {
            leftPoginationBtn.disabled = true;  
        }
        if(btn1Value>1){
            for( i of poginationBtn){
                let arr=Number(i.textContent)-10;
                i.innerHTML=arr;
            }
        }
    })
}

// pogination Click

let btnNumber=0;
let elBody = document.querySelector("body");
function sartirofka(totalitem,arr) {
    renderBook(arr);
    console.log(totalitem);
    elBody.addEventListener("click",(evt)=>{
        let text = evt.target.className;
        let text1=evt.target.id;
        if(text==='poginationBTN'){
            let b=evt.target.textContent;
            btnNumber= Number(b);
            if((btnNumber+1)*6<totalitem){
                fetch(`https://www.googleapis.com/books/v1/volumes?q=${elInput.value}&startIndex=${btnNumber*6}&maxResults=6&orderBy=${key}`)
                .then(response => response.json())
                .then(json => renderBook(json.items))
                .catch((err)=>console.log(err));
            }else{
                rigthPoginationBtn.disabled=true;
            }
        }
        if(text==="more-btn"){
            fetch(`https://www.googleapis.com/books/v1/volumes?q=${elInput.value}&startIndex=${btnNumber*6}&maxResults=6&orderBy=${key}`)
                .then(response => response.json())
                .then(json => more(json.items,text1))
                .catch((err)=>console.log(err));
        }
        
    });    
};

// bookmarkList

elBody.addEventListener("click",(evt)=>{
    let text1=evt.target.id;
    if(text1==='delete'){
        let atribute=evt.target.getAttribute("value");
        let item=JSON.parse(localStorage.getItem("bookmarkList"));
        localStorage.removeItem('bookmarkList');
        for (let i = 0; i < item.length; i++) {
            if(item[i].author===atribute){
                item.splice(i,1);
            }    
        }
        renderBookmark(item)
        localStorage.setItem("bookmarkList",JSON.stringify(item));
    }

})
let tem =JSON.parse(localStorage.getItem("bookmarkList"));
let arr=tem || [];
renderBookmark(arr);
elBody.addEventListener('click',(evt)=>{
    let name = evt.target.className;
    if(name==='bookmar-btn'){
        let author=evt.target.getAttribute("author");
        let names=evt.target.getAttribute("title");
        let previewlink=evt.target.getAttribute("previevlink");
        let obj={
            "author":author,
            "names":names,
            "previewlink":previewlink,
        }
        if(!arr.includes(obj)){arr.push(obj)}
        localStorage.setItem("bookmarkList", JSON.stringify(arr));
        renderBookmark(arr) ;
    }
});

let bookBody=document.querySelector(".book-body");

// functions

function renderBook(arr) {
    bookBody.innerHTML='';
    for(i of arr){
        let bookCard=document.createElement("div");
        let bookInfo=document.createElement("div");
        let bookimg=document.createElement("img");
        let bookp1=document.createElement("p");
        let bookp2=document.createElement("p");
        let bookmarh3=document.createElement("h3");
        let bookmarBtn=document.createElement("button");
        let moreBtn=document.createElement("button");
        let readBtn=document.createElement("button");
        let link=document.createElement("a");
        link.href=i.volumeInfo.previewLink;
        bookCard.setAttribute("class","book-card");
        bookInfo.setAttribute("id","bookmar-info");
        bookmarBtn.setAttribute("class","bookmar-btn");
        moreBtn.setAttribute("class","more-btn");
        moreBtn.setAttribute("type","button");
        moreBtn.setAttribute("data-bs-toggle","offcanvas");
        moreBtn.setAttribute("data-bs-target","#offcanvasRight");
        moreBtn.setAttribute("aria-controls","offcanvasRight");
        moreBtn.setAttribute("id",`${i.id}`);
        readBtn.setAttribute("class","read-btn");
        bookmarBtn.setAttribute("author",`${i.volumeInfo.authors}`);
        bookmarBtn.setAttribute("title",`${i.volumeInfo.title}`);
        bookmarBtn.setAttribute("previevlink",`${i.volumeInfo.previewLink}`);
        bookmarBtn.textContent="Bookmark";
        moreBtn.textContent="More info";
        readBtn.textContent="Read";
        bookimg.src=i.volumeInfo.imageLinks.smallThumbnail;
        bookmarh3.textContent=i.volumeInfo.title;
        bookp2.textContent=i.volumeInfo.publishedDate;
        bookp1.textContent=i.volumeInfo.authors;
        link.setAttribute("target","_blank");
        link.append(readBtn);
        bookInfo.append(bookmarBtn,moreBtn);
        bookCard.append(bookimg,bookmarh3,bookp1,bookp2,bookInfo,link);
        bookBody.append(bookCard);

    }    
}




function renderBookmark(arr) {
    elSaveds.innerHTML='';
    for(i of arr){
        let eldiv=document.createElement("div");
        let elspan1=document.createElement("span");
        let elspan2=document.createElement("span");
        let elspan3=document.createElement("span");
        let elspan4=document.createElement("span");
        let elh3=document.createElement("h3");
        let elp=document.createElement("p");
        eldiv.setAttribute("class","saved-card");
        elspan4.setAttribute("class","material-symbols-outlined more");
        elspan4.setAttribute("id","delete");
        elspan4.setAttribute("value",`${i.author}`);
        elspan3.innerHTML=` <a href=${i.previewlink} target="_blank"><span class="material-symbols-outlined concats">import_contacts</span></a>`;
        elspan4.textContent='more';
        elh3.textContent=i.names;
        elp.textContent=i.author;
        elspan1.append(elh3,elp);
        elspan2.append(elspan3,elspan4);
        eldiv.append(elspan1,elspan2);
        elSaveds.appendChild(eldiv);
    }
    
}
function more(jsonItems,text1) {
    for(i of jsonItems){
        if(i.id===text1){
            offcanvasBody.innerHTML='';
            let title=document.querySelector(".offcanvas-title");
            let elspan=document.createElement("span");
            let elspan1=document.createElement("span");
            let eldiv1=document.createElement("div");
            let eldiv2=document.createElement("div");
            let eldiv3=document.createElement("div");
            let eldiv4=document.createElement("div");
            let eldiv5=document.createElement("div");
            let elp1=document.createElement("p");
            let elp2=document.createElement("p");
            let elp4=document.createElement("p");
            let elp5=document.createElement("p");
            let elp6=document.createElement("p");
            let elp7=document.createElement("p");
            let elp8=document.createElement("p");
            let elp9=document.createElement("p");
            let elp10=document.createElement("p");
            let elp11=document.createElement("p");
            let elimg=document.querySelector("img");
            elspan1.setAttribute("class","read-end");
            title.innerHTML='';
            title.textContent=i.volumeInfo.title;
            elimg.src=i.volumeInfo.imageLinks.smallThumbnail;
            elspan.append(elimg);
            elp1.textContent=i.volumeInfo.description;
            elp2.textContent='Authors:';
            elp2.setAttribute("class",'one');
            eldiv1.append(elp2);
            for(j of i.volumeInfo.authors){
                let elp3=document.createElement("p");
                elp3.textContent=j;
                elp3.setAttribute("class","two");
                eldiv1.append(elp3);
            }
            elp4.textContent="Published:";
            elp4.setAttribute("class","one")
            elp5.textContent=i.volumeInfo.publishedDate;
            elp5.setAttribute("class","two");
            eldiv2.append(elp4,elp5);
            elp6.textContent="Publisher:";
            elp6.setAttribute("class","one");
            elp7.textContent=i.volumeInfo.publisher;
            elp7.setAttribute("class","two");
            eldiv3.append(elp6,elp7);
            elp8.textContent="Categories:";
            elp8.setAttribute("class","one");
            elp9.setAttribute("class","two");
            elp9.textContent=i.volumeInfo.categories;
            eldiv4.append(elp8,elp9);
            elp10.setAttribute("class","one");
            elp10.textContent="Pages Count::";
            elp11.textContent=i.volumeInfo.pageCount;
            elp11.setAttribute("class","two");
            eldiv5.append(elp10,elp11);
            elspan1.innerHTML=`
            <a href=${i.volumeInfo.previewLink} target="_blank">read</a>
            `;         
            offcanvasBody.append(elspan,elp1,eldiv1,eldiv2,eldiv3,eldiv4,eldiv5,elspan1)
            
        }
    }
}
