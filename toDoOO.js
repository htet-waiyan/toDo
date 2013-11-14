function Task(title,isFinished){
	this.title=title;
	this.isFinished=isFinished;
}

var toDo={
	tasks:[],
	createdDate:null,
	
	addTask:function(title){
		toDo.tasks.push(new Task(title,false));
	},
	
	removeTask:function(title){
		for(var i=0;i<toDo.tasks.length;i++){
			if(toDo.tasks[i].title===title){
				console.log('deleting.....'+toDo.tasks[i].title);
				toDo.tasks.splice(i,1);
				break;
			}
		}
		return;
	},
	
	modifyTask:function(title,value){
	console.log(value);
		for(var i=0;i<toDo.tasks.length;i++){
			if(toDo.tasks[i].title===title){
				toDo.tasks[i].title=value;
			}
		}
	},
	
	markTask:function(title){
		for(var i=0;i<toDo.tasks.length;i++){
			if(toDo.tasks[i].title===title){
				toDo.tasks[i].isFinished=true;
			}
		}
	},
	
	unmarkTask:function(title){
		for(var i=0;i<toDo.tasks.length;i++){
			if(toDo.tasks[i].title===title){
				toDo.tasks[i].isFinished=false;
			}
		}
	},
	
	markAll:function(){
		console.log('mark all');
		for(var i=0;i<toDo.tasks.length;i++){
			toDo.tasks[i].isFinished=true;
		}
	},
	
	unmarkAll:function(){
		console.log('unmark all');
		
		for(var i=0;i<toDo.tasks.length;i++){
			toDo.tasks[i].isFinished=false;
		}
	}
}

$(function(){
	$('#Ok').click(function(){
		$(this).parent().fadeOut(1000);
	});
	//start markall
	//to mark all tasks as finished ones
	if ('localStorage' in window && window['localStorage'] !== null){
		
		$('.noti p').text("LocalStorage has been supported. Your ToDo list can be saved now.");
		
		//one option for persisting in localStorage
		loadToDo();
		loadToDo=null;
		
		
	}
	else{
		$('.notification p').text("Your browser doesn't support localStorage. Please upgrade your browser.");
		$("#toggle").hide();
		$("#reset").hide();
	}
	
	checkLi();
	var originalTitle;
	
	$('#toggle').click(function(){
		saveToDo();
		saveToDo=null;
		$('#msg').text('Your ToDo list has been saved to localStorage');
		$('#msg').fadeIn(1000).delay(2000).fadeOut(1000);
	});
	
	$("#reset").click(function(){
		reset();
		reset=null;

		$('#msg').text('Your ToDo list has been deleted from localStorage');
		$('#msg').fadeIn(1000).delay(2000).fadeOut(1000);
	});
	
	$("#markAll").click(function(){

		if($(this).is(":checked")){
			$(".toDoView ul li").each(function(){
				$(this).children(":checkbox").prop("checked",true);
				$(this).children("span").css("text-decoration","line-through");
			});
			
			toDo.markAll();
			console.log(JSON.stringify(toDo.tasks));
		}
		else{
			$(".toDoView ul li").each(function(){
				$(this).children(":checkbox").prop("checked",false);
				$(this).children("span").css("text-decoration","none");
			});
			
			toDo.unmarkAll();
			console.log(JSON.stringify(toDo.tasks));
		}

	});//end mark-all
	
	//start #taskInput keyup event
	//to add a new task
	$('#taskInput').keyup(function(event){
	
		if(event.keyCode==13){
			var title=$(this).val().trim();
			
			if(title!=""){
			//create new li to wrap.
			var $newTask=$("<li></li>");

			//create mark checkbox, task title, and delete button
			var $toggleMark=$("<input type='checkbox'/>");
			var $title=$("<span>"+title+"</span>").addClass("adjust");
			var $delBtn=$("<button></button>");
			$delBtn.attr("title","delete");
			
			//append them to li
			$newTask.append([$toggleMark,$title,$delBtn]);
			$('ul').append($newTask);
			$('#taskInput').val("");

			$('#markAll').prop("checked",false);
			checkLi();
					
			toDo.addTask(title);
		}
			
			console.log(JSON.stringify(toDo.tasks));
		}
	});//end #taskInput keyup event
	
	//start checkbox click event to mark as finished
	$('ul').on("click","input[type='checkbox']",function(){
		var $markTask=$(this).siblings("span");

		if($(this).is(":checked")){
			$markTask.css("text-decoration","line-through");
			
			toDo.markTask($markTask.text().trim());
			
			console.log(JSON.stringify(toDo.tasks));
			//$markTask.children("label").attr("text-decoration","line-through");
		}
		else{
			$markTask.css("text-decoration","none");
			toDo.unmarkTask($markTask.text().trim());
			
			console.log(JSON.stringify(toDo.tasks));
		}

		$("#markAll").prop("checked",false);
	})//end checkbox event
	
	//for hover event to appear delete button
	$("ul").on("mouseenter","li",function(event){
		$(this).find("button").css("display","inline");
	})

	$("ul").on("mouseleave","li",function(event){
		$(this).find("button").css("display","none");
	})// end of hover event
	
	//to delete tasks
	$("ul").on("click","button",function(){
		var title=$(this).siblings('span').text().trim();
		console.log(title);
		toDo.removeTask(title);
		$(this).parents("li").remove();
		
		console.log(JSON.stringify(toDo.tasks));
		checkLi();
	})//end of delete code
	
	//dbclick event to edit tasks
	$("ul").on("dblclick","span",function(){
		var $focusTask=$(this);
		originalTitle=$focusTask.text();

		$focusTask.css('text-decoration','none');

		$focusTask.siblings(":checkbox").css("visibility","hidden");
		$focusTask.siblings("button").css("visibility","hidden");

		$focusTask.css("border","1px solid #B5C4D6");
		$focusTask.attr("contenteditable",true);
		$focusTask.focus();
		
		originalTitle=null;
	});//end of dbclick;
	
	//done editing when focusout
	$("ul").on("focusout","span",function(){
		var $focusTask=$(this);
		var value=$focusTask.text().trim();
		
		if(value==""){
			$focusTask.parents('li').remove();
		}
		else{
		toDo.modifyTask(originalTitle,value);
		console.log(JSON.stringify(toDo.tasks));
		}
		
		$focusTask.siblings(":checkbox").css("visibility","visible").prop("checked",false);
		$focusTask.siblings("button").css("visibility","visible");
		
		$focusTask.css("border","none");
		$focusTask.attr("contenteditable",false);
		
		originalTitle=null;

	});//end of editing.
	
	//saving edited tasks
	$("ul").on("keydown","span",function(event){
		if(event.keyCode==13){
			var $focusTask=$(this);
			var value=$focusTask.text().trim();
			
			if(value==""){
				console.log('value null||empty');
			}
			else{
				toDo.modifyTask(originalTitle,value);
				console.log(JSON.stringify(toDo.tasks));
			}
			
			$focusTask.siblings(":checkbox").css("visibility","visible").prop("checked",false);
			$focusTask.siblings("button").css("visibility","visible");

			$focusTask.css("border","none");
			$focusTask.css("outline","none");
			$focusTask.attr("contenteditable",false);
			
			originalTitle=null;
		}
	});//end of saving
});

function checkLi(){
	if($(".toDoView ul").children().length<=0){
		$("#markAll").css("display","none");
		$("#toggle").hide();
		$('#reset').hide();
	}
	else{
		$("#markAll").css("display","inline");
		$('#toggle').show();
		$('#reset').show();
	}
}

var loadToDo=function(){

	if(localStorage.length>0){
		toDo=JSON.parse(localStorage.getItem("toDo"));//localStorage.toDo; //localStorage["toDo"];
		console.log(typeof toDo);
		console.log(JSON.stringify(toDo));
		
		console.log(toDo.tasks[0].title);
		for(var i=0;i<toDo.tasks.length;i++){
			
			var $newTask=$("<li></li>");

			//create mark checkbox, task title, and delete button
			var $toggleMark=$("<input type='checkbox'/>");
			
			var $title=$("<span>"+toDo.tasks[i].title+"</span>").addClass("adjust");
			
			if(toDo.tasks[i].isFinished){
				$toggleMark.prop("checked",true);
				$title.css("text-decoration","line-through");
			}
			
			var $delBtn=$("<button></button>");
			$delBtn.attr("title","delete");
			
			//append them to li
			$newTask.append([$toggleMark,$title,$delBtn]);
			$('ul').append($newTask);
			$('#taskInput').val("");
			checkLi();
		}
	}
}

var saveToDo=function(){
	try{
		console.log('Saving....'+JSON.stringify(toDo));
		localStorage.setItem("toDo",JSON.stringify(toDo));
	}
	catch(e){
		if(e==QUOTA_EXCEEDED_ERR){
			alert('Storage full');
		}
	}
}
var reset=function(){
	console.log("reseting toDo list");
	localStorage.removeItem("toDo");
}