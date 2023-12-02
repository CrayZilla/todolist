$(document).ready(() => {
	/* CHECKBOX */
	function strikethroughText(task) {
		// Get content of task
		let content = task.children[1];
		let checkbox = task.children[0].children[0];

		(checkbox.checked) ? content.classList.add("strikethrough") : content.classList.remove("strikethrough");
	}

	/* EDIT */
	function editMode(task) {
		var content = task.children[1];
		var editContent = task.children[2];
		
		content.classList.add("hidden");
		editContent.classList.remove("hidden");

		var inputBox = editContent.children[0].children[0];
		inputBox.focus();
		inputBox.select();

		updateCheckbox(task);
	}

	function updateCheckbox(task) {
		let checkbox = task.children[0].children[0];
		var check = task.children[2].children[0].children[1];
		(checkbox.checked) ? check.value = "X" : check.value = "/";
	} 

	/* UPDATE DB */
	// At the moment, this is for when a checkbox is checked, it's saved to the database
	function updateDB(task) {
		updateCheckbox(task);

		var form = task.children[2];
		form.submit();
		
	}

	/* FUNCTION CALLS */
	for (i = 0; i < $("#todo").children().length; i++) strikethroughText(todo.children[i]);
	$(".checkbox").click((e) => {
		var task = e.target.parentElement.parentElement
		strikethroughText(task);
		updateDB(task);
	});

	$(".edit").click((e) => {editMode(e.target.parentElement.parentElement)});
	$(".task-content").dblclick((e) => {editMode(e.target.parentElement)});
});