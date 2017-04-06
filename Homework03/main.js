//Homework 03: Text Adventure Game V2
/*
MAP
[ ,s,W,B, , , , ]	s = spikes
[ ,s,W, ,M, , , ]	W = wall
[ ,s,W, , ,M, , ]	H = healPad
[ , , , , , , , ]	m = weakMonster
[ , , ,W,W,W,W,W]	M = mediumMonster
[ , , , , , ,s,b]	b = boss01(has prize01)
[ ,m, , , , ,W,W]	B = boss02(has prize02)
[ , , ,m, , ,s,H]	Goal & starting point is randomly placed

Notes: 
*/

const objectCopy = function (object) {
  var copy = {};
  for(key in object){
    copy[key] = object[key];
  }
  return copy;
}

const eventLogger = function(text) {
	eventLog.push("Log("+eventCount +")" + ": " + text);
	eventCount++;
	updateUserStatus()
	if(adventurer.hp <= 0) {

		document.write("lol");
		eventCount++;
	}

	var output = "";
	eventLog.forEach((t) => {
		output += "<h4>";
		output += t;
		output += "</h4>"
	});
	document.getElementById("eventLog").innerHTML = output;
	
	document.getElementById("eventLog").scrollTop = document.getElementById("eventLog").scrollHeight;
}

let eventLog = [];
let eventCount = 0;
const size = 8;
var level = [];
var noHealth = false;


function Point(x,y) {
	this.x = x
	this.y = y
}

//Created an 8x8 matrix with null values
function reset() {
	noHealth = false
	eventLog = [];
	eventCount = 0;
	level = [];
	for(var i = 0; i < size; i++) {
		var row = [];
		for(var j = 0; j < size; j++) {
			row.push(null);
		}
		level.push(row);
	}
}


function showLevel() {
	var output = "<tbody>";
	for(var i = 0; i < size; i++) {
		output += "<tr>"
		for(var j = 0; j < size; j++) {
			if(adventurer.posX == j && adventurer.posY == i && level[i][j] && level[i][j].name != "*")
				output += "<td class=\"success\">A&" + level[i][j].name[0] + "</td>";
			else if(adventurer.posX == j && adventurer.posY == i)
				output += "<td class=\"success\">A</td>";
			else if(!level[i][j])
				output += "<td class=\"danger\">X</td>";
			else if(level[i][j] && level[i][j].discovered && (level[i][j].name == "GOAL" ||level[i][j].name == "HealPad"))
				output += ("<td class =\"success\">" + level[i][j].name[0] + "</td>");
			else if(level[i][j] && level[i][j].discovered && (level[i][j].name == "MediumMonster"||level[i][j].name == "LowMonster"||level[i][j].name == "Boss"))
				output += ("<td class =\"primary\">" + level[i][j].name[0] + "</td>");
			else if(level[i][j] && level[i][j].discovered && level[i][j].name != "*")
				output += ("<td class =\"info\">" + level[i][j].name[0] + "</td>");
			else if(level[i][j] && level[i][j].discovered)
				output += ("<td class =\"warning\">" + level[i][j].name[0] + "</td>");
			else
				output += "<td class=\"danger\">X</td>";
		}
		output += "</tr>";
	}
	output += "</tbody>";
	document.getElementById("mazeViewer").innerHTML = output;
}

var adventurer = {	//Don't think this has to be changed
	name:"Player",
	hp:30,
	atk:3,
	def:1,
	prizeBag:[],
	posX: 0,
	posY: 0,
	addPrize: function(prize) {
		this.prizeBag.push(prize)
	},
	setPosition(x,y) {
		this.posX = x
		this.posY = y
	},
	moveUp(){
		if(this.posY === 0) {
			eventLogger("Can't move up.")
		}
		else {
			this.posY--;
			if(level[this.posY][this.posX])
				level[this.posY][this.posX].discovered = true;
			else{
				level[this.posY][this.posX] = { name: "*", discovered:true};
			}
		}
	},
	moveDown(){
		if(this.posY === size - 1) {
			eventLogger("Can't move down.")
		}
		else {
			this.posY++;
			if(level[this.posY][this.posX])
				level[this.posY][this.posX].discovered = true;
			else{
				level[this.posY][this.posX] = { name: "*", discovered:true};
			}
		}
	},
	moveLeft(){
		if(this.posX === 0) {
			eventLogger("Can't move left.")
		}
		else {
			this.posX--;
			if(level[this.posY][this.posX])
				level[this.posY][this.posX].discovered = true;
			else{
				level[this.posY][this.posX] = { name: "*", discovered:true};
			}
		}
	},
	moveRight(){
		if(this.posX === size - 1) {
			eventLogger("Can't move right.")
		}
		else {
			this.posX++;
			if(level[this.posY][this.posX])
				level[this.posY][this.posX].discovered = true;
			else{
				level[this.posY][this.posX] = { name: "*", discovered:true};
			}
		}
	}
}

function attackPhase(attacker) {
	eventLogger(`${attacker.name} deals ${attacker.atk} damage!\n`);
	return attacker.atk
}

function Challenge(monster,challenge) {		
	this.monster = monster
	this.challenge = challenge
}

function Monster(name, hp, atk, prize = false) {	
	this.name = name
	this.hp = hp
	this.atk = atk
	this.prize = prize
	this.runChallenge = function(player) {
		eventLogger(`${player.name} encountered ${this.name}!`);
		this.hp -= attackPhase(player)
		player.hp -= attackPhase(this)
	}
}

function Hazard(name, sideEffect) {
	this.name = name,
	this.sideEffect= sideEffect
}

function battleTest(a,m){
	while(a.hp > 0 && m.hp > 0) {
		eventLogger(`Adventurer HP: ${a.hp}\nMonster HP: ${m.hp}`);
		m.runChallenge(a)
	}
	document.write("test over")
}




function checkStatus(){
	if(adventurer.hp <= 0) {
		document.getElementById("upButton").disabled = true;
		document.getElementById("downButton").disabled = true;
		document.getElementById("leftButton").disabled = true;
		document.getElementById("rightButton").disabled = true;
		eventLogger("You lost all your HP.. You lose.")
	}
}

function updateUserStatus(){
	var output = [];
	output += `<h3>HP:${adventurer.hp}, Atk: ${adventurer.atk}, Prizes:${adventurer.prizeBag}\n`;
	output += `<h3>Player pos: (${adventurer.posX},${adventurer.posY})</h3>`;
	document.getElementById("userStatus").innerHTML = output;
	showLevel();
	checkStatus();
}


function startUp() {
	reset();
	adventurer = {	//Don't think this has to be changed
	name:"Player",
	hp:30,
	atk:3,
	def:1,
	prizeBag:[],
	posX: 0,
	posY: 0,
	addPrize: function(prize) {
		this.prizeBag.push(prize)
	},
	setPosition(x,y) {
		this.posX = x
		this.posY = y
	},
	moveUp(){
		if(this.posY === 0) {
			eventLogger("Can't move up.")
		}
		else {
			this.posY--;
			if(level[this.posY][this.posX])
				level[this.posY][this.posX].discovered = true;
			else{
				level[this.posY][this.posX] = { name: "*", discovered:true};
			}
		}
	},
	moveDown(){
		if(this.posY === size - 1) {
			eventLogger("Can't move down.")
		}
		else {
			this.posY++;
			if(level[this.posY][this.posX])
				level[this.posY][this.posX].discovered = true;
			else{
				level[this.posY][this.posX] = { name: "*", discovered:true};
			}
		}
	},
	moveLeft(){
		if(this.posX === 0) {
			eventLogger("Can't move left.")
		}
		else {
			this.posX--;
			if(level[this.posY][this.posX])
				level[this.posY][this.posX].discovered = true;
			else{
				level[this.posY][this.posX] = { name: "*", discovered:true};
			}
		}
	},
	moveRight(){
		if(this.posX === size - 1) {
			eventLogger("Can't move right.")
		}
		else {
			this.posX++;
			if(level[this.posY][this.posX])
				level[this.posY][this.posX].discovered = true;
			else{
				level[this.posY][this.posX] = { name: "*", discovered:true};
			}
		}
	}
}
	var weakMonster = new Monster("LowMonster",10,1,false)
	var mediumMonster = new Monster("MediumMonster",15,2,false)
	var boss01 = new Monster("Boss",25,3,"Prize01")
	var boss02 = new Monster("Boss",35,2,"Prize02")
	var wall = new Hazard("Wall", (direction) => {
		eventLogger("Wall blocks your path.");
		switch (direction){
		case "l":
			adventurer.moveRight();
			break;
		case "r":
			adventurer.moveLeft();
			break;
		case "u":
			adventurer.moveDown();
			break;
		case "d":
			adventurer.moveUp();
			break;
		}
	});
	var spikes = new Hazard("Spikes",() => {
		eventLogger("You stepped on some spikes. You lost 1 HP");
		adventurer.hp -= 1;
	});
	var healPad = new Hazard("HealPad",() => {
		eventLogger("You stepped on a healpad. HP+2(Hint: There is no HP cap btw)");
		adventurer.hp += 2;
	})
	var goal = new Hazard("GOAL", () => {
		if(adventurer.prizeBag.length == 2){
			eventLogger("CONGRATULATIONS, YOU'VE REACHED THE GOAL WITH THE PRIZES. YOU WIN!!");
			eventLogger("GAME OVER");
			document.getElementById("upButton").disabled = true;
			document.getElementById("downButton").disabled = true;
			document.getElementById("leftButton").disabled = true;
			document.getElementById("rightButton").disabled = true;
		}
		else
			eventLogger("You've reached the goal but you don't have all the prizes.");
	})
	//CREATED CHALLENGE/HAZARD OBJECT FOR EACH SQUARE THAT HAS ONE
	level[0][1] = objectCopy(spikes);
	level[0][2] = objectCopy(wall);
	level[0][3] = objectCopy(boss02);
	level[1][1] = objectCopy(spikes);
	level[1][2] = objectCopy(wall);
	level[1][4] = objectCopy(mediumMonster);
	level[2][1] = objectCopy(spikes);
	level[2][2] = objectCopy(wall);
	level[2][5] = objectCopy(mediumMonster);
	level[4][3] = objectCopy(wall);
	level[4][4] = objectCopy(wall);
	level[4][5] = objectCopy(wall);
	level[4][6] = objectCopy(wall);
	level[4][7] = objectCopy(wall);
	level[5][6] = objectCopy(spikes);
	level[5][7] = objectCopy(boss01);
	level[6][1] = objectCopy(weakMonster);
	level[6][6] = objectCopy(wall);
	level[6][7] = objectCopy(wall);
	level[7][3] = objectCopy(weakMonster);
	level[7][6] = objectCopy(spikes);
	level[7][7] = objectCopy(healPad);
	var foundEmptySpace = false;
	while(!foundEmptySpace){
		var locationX = Math.floor((Math.random() * size));
		var locationY = Math.floor((Math.random() * size));
		if(!level[locationY][locationX]){
			level[locationX][locationY] = goal;
			foundEmptySpace = true;
		}
	}
	foundEmptySpace = false;
	while(!foundEmptySpace){
		var locationX = Math.floor((Math.random() * size));
		var locationY = Math.floor((Math.random() * size));
		if(!level[locationY][locationX]){
			adventurer.posX = locationX;
			adventurer.posY = locationY;
			foundEmptySpace = true;
		}
	}
	level[locationY][locationX] = {name:"*",discovered:true}
}


function event(direction) {
	document.getElementById("takeChallengeButton").disabled = true;
	document.getElementById("challengeNotification").hidden = true;
	if(level[adventurer.posY][adventurer.posX].name == "*"){
		eventLogger("You're in an empty room.");
	}
	else if(level[adventurer.posY][adventurer.posX].name == "Spikes"){
		level[adventurer.posY][adventurer.posX].sideEffect();
	}
	else if(level[adventurer.posY][adventurer.posX].name == "HealPad"){
		level[adventurer.posY][adventurer.posX].sideEffect();
	}
	else if(level[adventurer.posY][adventurer.posX].name == "Wall"){
		level[adventurer.posY][adventurer.posX].sideEffect(direction);
	}
	else if(level[adventurer.posY][adventurer.posX].name == "GOAL"){
		level[adventurer.posY][adventurer.posX].sideEffect(direction);
	}
	else if(level[adventurer.posY][adventurer.posX]){
/*		var choice = true;
		while(choice) {
			choice = confirm("This room has a challenge! Would you like to attempt it?");
			if(choice) {
				level[adventurer.posY][adventurer.posX].runChallenge(adventurer);
				if(level[adventurer.posY][adventurer.posX].hp <= 0) {
					eventLogger("You slayed the monster!!");
					if(level[adventurer.posY][adventurer.posX].prize){
						eventLogger("You recieve a prize for defeating a boss!! atk+2, hp+15");
						adventurer.prizeBag.push(level[adventurer.posY][adventurer.posX].prize);
						adventurer.atk += 2;
						adventurer.hp += 15;
					}
					level[adventurer.posY][adventurer.posX] = {name:"*", discovered:true};
					choice = false;
				}
			}
		}*/
		eventLogger("This room has a challenge! Would you like to attempt it?");
		document.getElementById("takeChallengeButton").disabled = false;
		document.getElementById("challengeNotification").hidden = false;
	}
}

function challengeSegment() {
	level[adventurer.posY][adventurer.posX].runChallenge(adventurer);
	if(level[adventurer.posY][adventurer.posX].hp <= 0) {
		eventLogger("You slayed the monster!!");
		if(level[adventurer.posY][adventurer.posX].prize){
			eventLogger("You recieve a prize for defeating a boss!! atk+2, hp+15");
			adventurer.prizeBag.push(level[adventurer.posY][adventurer.posX].prize);
			adventurer.atk += 3;
			adventurer.hp += 15;
		}
		else{
			eventLogger("You recieve a power up for defeating an enemy!! atk+1, hp+10");
			adventurer.atk += 1;
			adventurer.hp += 10;
		}

		level[adventurer.posY][adventurer.posX] = {name:"*", discovered:true};
		document.getElementById("takeChallengeButton").disabled = true;
		document.getElementById("challengeNotification").hidden = true;
	}
	updateUserStatus();
}
