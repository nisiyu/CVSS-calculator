/**
 * Created by siyu on 2016/3/20.
 */
$(".cvss").click(function(){
alert(1);
});

$("input").click(function(){
    var name = this.name;
    $("input[name=\"" + name + "\"]").css("background-color","white");
    $(this).css("background-color","#ccc");
});