import express from "express";
import {readFileSync, createWriteStream} from "fs";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var generalData = [];
var workData = [];

var currDB;
readFileSync("DB/currDB.txt", "utf-8").split().forEach(l => {currDB = l});

function getData() {
	var data = [];
	readFileSync(`DB/${currDB}.txt`, 'utf-8').split(/\r?\n/).forEach(l => {
		var task = l.substring(2);
		var checked = l[0];

		if (task != "") {
			data.push([task, checked]);
		}
		
	});

	(currDB == "general") ? generalData = data : workData = data;
	return data
}

function saveData(blacklist = "", replacement = "") {
	let file = createWriteStream(`DB/${currDB}.txt`, "utf8", 'a');
	
	var data;
	(currDB == "general") ? data = generalData : data = workData;

	for (var i = 0; i < data.length; i++) {
		var task = data[i][0];
		var checked = data[i][1];
		
		if (task != "") {
			file.write(checked + " " + task + "\n");
		}
	}

	getData();
}

function addToDB(newdata, checked) {
	if (currDB == "general"){
		(checked) ? (generalData.push([newdata, "X"])) : (generalData.push([newdata, "/"]));
	} else if (currDB == "work") {
		(checked) ? (workData.push([newdata, "X"])) : (workData.push([newdata, "/"]));
	}
	saveData();
}

function removeFromDB(id) {
	(currDB == "general") ? (generalData.splice(id, 1)) : (workData.splice(id, 1));
	saveData();
}

function swapOnDB(id, newTask, checked) {
	(currDB == "general") ? (generalData[id] = [newTask, checked]) : (workData[id] = [newTask, checked]);
	saveData();
}

app.get("/", (req, res) => {
	res.render("index.ejs", {todo: getData(currDB)});
});

/* CREATE A TASK */
app.post("/new", (req, res) => {
	let newTask = req.body["TASK"];

	(newTask != "") ? addToDB(newTask, false) : null;
	res.redirect("/");							//  Must be done before render (otherwise every refresh has "Confirm Form Resubmittion" on it)
	// res.render("index.ejs", {todo: data});      	<-- However, no need as it is grabbed automatically (post-function)
});

/* DELETE A TASK */
app.post("/delete", (req, res) => {
	let taskID = req.body["TASK_ID"];

	removeFromDB(taskID);
	res.redirect("/")
})

/* EDIT A TASK */
app.post("/edit", (req, res) => {
	let newTask = req.body["TASK"];
	let checked = req.body["CHECKED"]
	let oldTaskID = req.body["TASK_ID"];
	
	swapOnDB(oldTaskID, newTask, checked);
	res.redirect("/")
})

app.post("/switch", (req, res) => {
	let mode = req.body["MODE"];

	currDB = mode;
	let f = createWriteStream(`DB/currDB.txt`, "utf8", 'a');
	f.write(mode);

	res.redirect("/")
})

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});