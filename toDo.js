$(function(){
	
	checkLi();
	$("#markAll").click(function(){

		if($(this).is(":checked")){
			$(".toDoView ul li").each(function(){
				$(this).children(":checkbox").prop("checked",true);
				$(this).children("span").css("text-decoration","line-through");
			});
		}
		else{
			$(".toDoView ul li").each(function(){
				$(this).children(":checkbox").prop("checked",false);
				$(this).children("span").css("text-decoration","none");
			});
		}

	});
	$('#taskInput').keyup(function(event){
		if(event.keyCode==13){
			var task=$(this).val().trim();

			if(task!=""){
					//create new li to wrap.
					var $newTask=$("<li></li>");

					//create mark checkbox, task title, and delete button
					var $toggleMark=$("<input type='checkbox'/>");
					var $title=$("<span>"+task+"</span>").addClass("adjust");
					var $delBtn=$("<button><img src='trash.png'></button>");
					$delBtn.attr("title","delete");
					//append them to li
					$newTask.append([$toggleMark,$title,$delBtn]);
					$('ul').append($newTask);
					$('#taskInput').val("");

					$('#markAll').prop("checked",false);
					checkLi();
					return;
				}
				
			}	
		});

	$('ul').on("click","input[type='checkbox']",function(){
		var $markTask=$(this).siblings("span");

		if($(this).is(":checked")){
			$markTask.css("text-decoration","line-through");

			//$markTask.children("label").attr("text-decoration","line-through");
		}
		else{
			$markTask.css("text-decoration","none");
		}

		$("#markAll").prop("checked",false);
	})

	$("ul").on("click","button",function(){
		$(this).parents("li").remove();

		checkLi();
	})

	$("ul").on("dblclick","span",function(){
		var $focusTask=$(this);

		$focusTask.siblings(":checkbox").css("visibility","hidden");
		$focusTask.siblings("button").css("visibility","hidden");

		$focusTask.css("border","1px solid #B5C4D6");
		$focusTask.attr("contenteditable",true);
		$focusTask.focus();
	});

	$("ul").on("focusout","span",function(){
		var $focusTask=$(this);

		$focusTask.siblings(":checkbox").css("visibility","visible");
		$focusTask.siblings("button").css("visibility","visible");

		$focusTask.css("border","none");
		$focusTask.attr("contenteditable",false);

	});

	$("ul").on("keydown","span",function(event){
		if(event.keyCode==13){
			var $focusTask=$(this);
			$focusTask.siblings(":checkbox").css("visibility","visible");
			$focusTask.siblings("button").css("visibility","visible");

			$focusTask.css("border","none");
			$focusTask.css("outline","none");
			$focusTask.attr("contenteditable",false);
			return false;
		}
	});

	$("ul").on("mouseover","li",function(event){
		$(this).find("button").css("display","inline");
	})

	$("ul").on("mouseout","li",function(event){
		$(this).find("button").css("display","none");
	})
});

function checkLi(){
	if($(".toDoView ul").children().length<=0){
		$("#markAll").css("display","none");
	}
	else{
		$("#markAll").css("display","inline");
	}
}
