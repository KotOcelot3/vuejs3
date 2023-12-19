let eventBus = new Vue()

Vue.component('cards-kanban', {
    template:`
    <div>
        <fill></fill>
        <div id="columns">
            <column1 :column1="column1"></column1>
        </div>
    </div>
    `,
    data() {
        return {
            column1:[],
            showCard: true,
        }
    },
    mounted() {

        eventBus.$on('card-create', card => {
            this.column1.push(card)
        })
    }
})

Vue.component('fill', {    //дата создания, заголовок, описание задачи, дедлайн
    template:`
    <div>
        <button v-if="!show" @click="openModal">Добавьте задачу</button>
        <div id="form" v-if="show" class="modal-shadow">
            <div class="modal">
                <div class="modal-close" @click="closeModal">&#10006;</div>
                <h3>Заполните карточку задачи</h3>
                <form @submit.prevent="onSubmit">
                    <p class="pForm">Введите заголовок: 
                        <input required type="text" v-model="title" maxlength="30" placeholder="Заголовок">
                    </p>
                    <p class="pForm">Добавьте описание задаче:</p>
                    <textarea v-model="description" cols="40" rows="4"></textarea>
                    <p class="pForm">Укажите дату дедлайна: 
                        <input required type="date" v-model="dateD">
                    </p>
                    <p class="pForm">
                        <input class="button" type="submit" value="Добвить задачу">
                    </p>
                </form>
            </div>
        </div>    
    </div>
    `,
    data(){
        return {
            title: null,
            description: null,
            dateD: null,
            show: false
        }
    },
    methods: {
        onSubmit() {
            let card = {
                title: this.title,
                description: this.description,
                dateD: this.dateD,                  //дата дедлайна
                dateC: new Date().toLocaleString(),   //дата создания
                updateCard: false,
                dateL: null,                            //дата последних изменений
                dateE: null,                            //дата выполнения
                inTime: true,                            //в срок или нет
                reason: []
            }
            eventBus.$emit('card-create', card)
            this.title = null
            this.description = null
            this.dateD = null
            this.closeModal()
            console.log(card)
        },
        closeModal(){
            this.show = false
        },
        openModal(){
            this.show = true
        }
    }
})
