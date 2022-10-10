/* creando y montando la aplicacion de vue */
window.addEventListener('load', () =>{

    const app = Vue.createApp({
        data () {
            return {
                users: [],
                /* se crea un enlace del v-model de los inputs del html para agregar un usuario */
                user:{
                    id: '',
                    name: '',
                    username: '',
                    email: ''
                },
                /* segun la operacion del formulario que por defecto va a registrar */
                operation:'Registrar',
                userIndex:-1,
            }
        },
        /* cuando este creado se manda a llamar el objeto con created */
        created(){
            if (localStorage.getItem('vue3.users') != null) {
                this.users=JSON.parse(localStorage.getItem('vue3.users'))
            } else {
                /* hace la peticion a la api */
                this.listUsers();
            }
        },
        mounted() {
            this.$refs.name.focus();
        },
        methods: {
            /* las peticiones son asincronas por lo tanto se les debe agregar un async y await en el resultado */
            listUsers: async function(){
                const res = await fetch('https://jsonplaceholder.typicode.com/users');
                const data = await res.json();
                /* ver lo que trae la data */
                // console.log(data);
                this.users=data.slice(0,5); 
                this.updateLocalStorage();               
            },
            /* el localstorage va a ser como nuestra base de datos local */
            updateLocalStorage:function(){
                localStorage.setItem('vue3.users', JSON.stringify(this.users));
            },
            /* procesando para no recargar la pagina */
            processUser: function(event){
                event.preventDefault();
                if (this.operation=="Registrar") {
                    /* esta es la logica simple de lista ya que cuando se crea no se guarda en una bd */
                    this.user.id=this.users.length+1;
                    /* aqui se crea */
                    this.users.push({
                        id:this.user.id,
                        name:this.user.name,
                        username:this.user.username,
                        email:this.user.email
                    });
                    
                } else {
                    /* aqui actualiza */
                    this.users[this.userIndex].name=this.user.name;
                    this.users[this.userIndex].username=this.user.username;
                    this.users[this.userIndex].email=this.user.email;
                }
                /* actualizo el localstorage */
                this.updateLocalStorage();
                /* limpio el formulario */
                this.clearFields();
            },
            /* editar usuario */
            editUser:function(id){
                /* aqui cambio el texto del boton */
                this.operation = "Actualizar";
                const userFound = this.users.find((user, index) => {
                    this.userIndex = index;
                    return user.id == id;
                });
                /* pintamos los datos */
                this.user.name = userFound.name;
                this.user.username = userFound.username;
                this.user.email = userFound.email;
            },
            /* eliminando un usuario */
            deleteUser:function(id, event){
                const confirmation=confirm('¿Quieres eliminar al usuario?');
                if (confirmation) {
                    this.users=this.users.filter(user=>user.id!=id);
                    /* actualizo el localstorage */
                    this.updateLocalStorage();
                }else{
                    event.preventDefault();
                }
            },
            /* cambiar el nombre a los botones y limpiar */
            clearFields: function () {
                this.user.id = "";
                this.user.name = "";
                this.user.username = "";
                this.user.email = "";
                this.operation = "Registrar";
                this.$refs.name.focus();
            }
        }
    });

    app.mount('#app');
});
