type todo = {"uid":string,"created_at":number,"text":string,"done":boolean}
export const TodoList :todo[] = []

export function AddTodo(text:string):todo{
    const todo :todo ={
        uid: uuidv4(),
        text,
        created_at:Date.now(),
        done:false
    }
    TodoList.push(todo)
    return todo
}

export function PatchTodo(uid:string, obj: Partial<todo>):todo{
    const todo = TodoList.find(el=>el.uid===uid)
    Object.entries(obj).forEach(([key,value])=>{
        if(value!==undefined){
            todo[key] = value
        }else{

        }
    })
    return todo
}

export function DeleteTodo(uid:string):{}{
    const todoIndex = TodoList.findIndex(el=>el.uid===uid)
    TodoList.splice(todoIndex,1)
    return {}
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }