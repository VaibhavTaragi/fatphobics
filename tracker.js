//Workout Class: Represents a workout session
class Workout{
    constructor(date, workout, duration, id){
        this.date=date;
        this.workout=workout;
        this.duration=duration;
        this.id=id;
    }
}

//UI Class: Handle UI Tasks
class UI{
    static displayWorkouts(){
        const workouts = Store.getWorkouts();

        workouts.forEach((workout)=> UI.addWorkoutToList(workout));
    }

    static addWorkoutToList(work) {
        const list = document.querySelector('#track-list');

        const row= document.createElement('tr');

        row.innerHTML= `
            <td>${work.date}</td>
            <td>${work.workout}</td>
            <td>${work.duration}</td>
            <td>${work.id}</td>
            <td><a href ="#" class="delete-btn">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteWorkout(t){
        if(t.classList.contains('delete-btn')){
            t.parentElement.parentElement.remove();
        }
    }
    
    static showAlert(message, className){
        const div= document.createElement('div');
        div.className=`alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.form');
        const form = document.querySelector('#workoutForm');
        container.insertBefore(div, form);

        //Vanish in 2 secs
        setTimeout(()=>document.querySelector('.alert').remove(),2000);
    }

    static clearFileds(){
        document.querySelector('#date').value='';
        document.querySelector('#workoutName').value='';
        document.querySelector('#duration').value='';
    }
}

//Store Class: Handles Storage
class Store{
    static getWorkouts(){
        let wos;
        if(localStorage.getItem('wos')===null){
            wos=[];
        }else{
            wos=JSON.parse(localStorage.getItem('wos'));
        }

        return wos;
    }

    static addWorkout(wo){
        const wos= Store.getWorkouts();

        wos.push(wo);

        localStorage.setItem('wos',JSON.stringify(wos));
    }

    static removeWorkout(id){
        const wos = Store.getWorkouts();

        wos.forEach((wo,index)=>{
            if(wo.id=== Number(id)){
                wos.splice(index,1);
            }
        });

        localStorage.setItem('wos',JSON.stringify(wos));
    }
}

//Event: Display Workout
document.addEventListener('DOMContentLoaded', UI.displayWorkouts);

//Event: Add Workout
document.querySelector('#workoutForm').addEventListener('submit',(e)=>{
    //prevent actual submit
    e.preventDefault();

    //Get Form Values
    const date= document.querySelector('#date').value;
    const workName= document.querySelector('#workoutName').value;
    const duration= document.querySelector('#duration').value;
    const id = Math.floor(Math.random()*1000);

    //Validate
    if(date===''|| workName===''||duration===''){
        UI.showAlert("Please enter all details",'danger');
    }else{
        //Instantiate Workout Class
        const workout = new Workout(date, workName, duration, id);

        //Add workout to UI
        UI.addWorkoutToList(workout);

        //Add workout to storage
        Store.addWorkout(workout);

        //Show success Message
        UI.showAlert("Successfully added workout details",'success');

        //Clear Fields
        UI.clearFileds();
    }
});

//Event: Remove a workout
document.querySelector('#track-list').addEventListener('click',(e)=>{

    //Remove Book from UI
    UI.deleteWorkout(e.target);

    //Remove Book from storage
    Store.removeWorkout(e.target.parentElement.previousElementSibling.textContent);

    //Show alert of workout deleted
    UI.showAlert("Workout detail removed",'success');
});