setTimeout(function(){closeNav()}, 2000);

function openNav(){
    document.getElementById("sidebar").style.width = "200px";

    document.querySelector(".pop").style.marginLeft = "150px";
    
    setTimeout(function(){closeNav()}, 10000);
}
function closeNav(){
    document.getElementById("sidebar").style.width = "0px";
    document.querySelector(".pop").style.marginLeft = "-30px";
}