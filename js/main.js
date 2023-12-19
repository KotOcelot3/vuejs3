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


Vue.component('column1', {  //создание, удаление, редактирование карточки, время последнего редактирования
    props:{                 // перемещение карточки во второй столбец
        column1: {
            type: Array,
            required: true
        },
    },
    template:`
    <div class="column">
        <h3>Запланированные задачи</h3>
        <div class="card" v-for="card in column1">
            <ul>
                <li class="title"><b>Заголовок:</b> {{ card.title }}</li>
                <li><b>Описание задачи:</b> {{ card.description }}</li>
                <li><b>Дата дедлайна:</b> {{ card.dateD }}</li>
                <li><b>Дата создания:</b> {{ card.dateC }}</li>
                <li v-if="card.dateL"><b>Дата последних изменений</b>{{ card.dateL }}</li>
                <button @click="deleteCard(card)">Удалить</button>
                <button @click="updateC(card)">Изменить</button>
                <div class="change" v-if="card.updateCard">
                    <form @submit.prevent="updateTask(card)">
                        <p>Введите заголовок: 
                            <input type="text" v-model="card.title" maxlength="30" placeholder="Заголовок">
                        </p>
                        <p>Добавьте описание задаче: 
                            <textarea v-model="card.description" cols="20" rows="5"></textarea>
                        </p>
                        <p>Укажите дату дедлайна: 
                            <input type="date" v-model="card.dateD">
                        </p>
                        <p>
                             <input class="button" type="submit" value="Изменить карточку">
                        </p>
                    </form>
                </div>
             </ul>
            <button @click="moving(card)">--></button>
        </div>
    </div>
    `,
    methods: {
        deleteCard(card){
            this.column1.splice(this.column1.indexOf(card), 1)
        },
        updateC(card){
            card.updateCard = true
        },
        updateTask(card){
            this.column1.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
            card.dateL = new Date().toLocaleString()
            return card.updateCard = false
        },
        moving(card){
            eventBus.$emit('moving1', card)
        }
    },
})
