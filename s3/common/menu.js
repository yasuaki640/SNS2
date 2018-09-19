Vue.component("common-menu", {
    props: ["current"],
    template:`
        <div class="ui secondary pointing green inverted massive menu">
            <a class="item" href="./index.html" v-bind:class="{active: current=='home'}">
                Home
                </a>
            <a class="item" href="./users.html" v-bind:class="{active: current=='users'}">
                Users
                </a>
            <a class="item" href="./profile.html" v-bind:class="{active: current=='profile'}">
                Profile
                </a>
            <div class="right menu">
                <button class="item" v-on:click="logout">
                    LogOut
                    </button>
            </div>  
        </div>
        `,
    methods: {
        logout: function () {
            localStorage.removeItem(`token`)
            localStorage.removeItem(`userId`);
            location.href ="./login.html"
        }
    }
        
});