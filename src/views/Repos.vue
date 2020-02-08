<template>

    <div>

        <div class="create-repo row">
            <div class="row col-6">
                <label class="control-label col-2" for="repo-name">Repo Name</label>
                <div class="col-10">
                    <input type="text" v-model="newRepoName" id="repo-name" class="form-control" name="repoName">
                </div>
            </div>
            <button v-if="!loading" class="btn btn-primary" v-on:click="createRepo()">Create Repo</button>
        </div>


        <div class="home row">

            <div class="col-6">
                <div class="card centeralign " v-for="repo in repoList" :key="repo.id">
                    <div class="card-body" v-on:click="setSelectedRepo(repo.name)">
                        <h5 class="card-title">{{ repo.name }}</h5>
                        <p class="card-text">{{ repo.owner.login }}</p>

                        <a class="btn btn-primary" v-on:click="loadRepoCommits(repo.name, repo.owner.login, 0)">
                            <span style="color:white">Show commits</span>
                        </a>
                        <a class="btn btn-primary" v-on:click="importRepoCommits(repo.name, repo.owner.login)">
                            <span style="color:white">Import commits</span>
                        </a>
                        <a class="btn btn-primary" v-on:click="deleteRepoCommits(repo.name, repo.owner.login)">
                            <span style="color:white">Delete commits</span>
                        </a>
                    </div>
                </div>
            </div>

            <div class="col-6">
                <img v-if="loading" src="../assets/720.gif" style="height: 20px;">
                <div class="col-12 row error" v-if="errorText">
                    <p class="alert danger">{{ errorText }}</p>
                </div>
                <div class="col-12 row info" v-if="messageText">
                    <p class="alert info">{{ messageText }}</p>
                </div>
                <div class="col-12 row pagination" v-if="commitList.length > 0">
                    <a class="btn btn-primary"
                       v-if="currentRepo.page > 1"
                       v-on:click="commitsPrevPage()">
                        <span style="color:white">Prev Page</span>
                    </a>
                    <a class="btn btn-primary"
                       v-if="!nextPageError"
                       v-on:click="commitsNextPage()">
                        <span style="color:white">Next Page</span>
                    </a>
                </div>
                <div class="card centeralign" v-for="commit in commitList" :key="commit.sha">
                    <div class="card-body" v-on:click="setSelectedRepo(commit.commit.message)">
                        <span class="card-text">{{ commit.commit.author.name }}</span>:<span class="card-title">{{ commit.commit.message }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

    // @ is an alias to /src
    import Display from '@/components/Display.vue'
    import axios from 'axios'
    import {backendUrl} from '../../vue.config'

    export default {
        name: 'Repos',

        components: {
            Display
        },
        data() {
            return {
                newRepoName: '',
                loading: false,
                repoList: [],
                selectedRepo: "",
                commitList: [],
                errorText: "",
                messageText: "",
                nextPageError: false,
                currentRepo: {
                    name: '',
                    author: '',
                    page: 1
                }
            }
        },
        mounted() {
            this.refreshRepoList();
        },

        methods: {
            setNetworkStarted: function () {
                this.loading = true;
                this.errorText = '';
                this.messageText = '';
            },
            refreshRepoList: function () {
                this.setNetworkStarted();
                axios({
                    method: "GET",
                    url: backendUrl
                }).then(response => {
                    this.repoList = response.data;
                    this.loading = false;
                }, error => {
                    this.errorText = error.message;
                    this.loading = false;
                });
            },
            setSelectedRepo: function (name) {
                this.selectedRepo = name;
            },
            loadRepoCommits: function (repoName, owner, page) {
                this.setNetworkStarted();
                this.commitList = [];
                axios({
                    method: "GET",
                    url: backendUrl + "/list-repo-commits?login=" + owner + "&repoName=" + repoName + "&page=" + page,
                }).then(response => {
                    this.currentRepo = {
                        name: repoName,
                        author: owner,
                        page: 1
                    };

                    this.commitList = response.data;
                    this.nextPageError = false;
                    this.loading = false;
                }, error => {
                    this.errorText = error.message;
                    this.loading = false;
                });
            },
            commitsNextPage: function () {
                let page = this.currentRepo.page + 1;
                this.setNetworkStarted();
                axios({
                    method: "GET",
                    url: backendUrl + "/list-repo-commits?login=" + this.currentRepo.author + "&repoName=" + this.currentRepo.name + "&page=" + page,
                }).then(response => {
                    this.currentRepo.page++;
                    this.commitList = response.data;

                    if (this.commitList.length < 20) {
                        this.nextPageError = true;
                    }
                    this.loading = false;
                }, error => {
                    this.nextPageError = true;
                    this.errorText = error.message;
                    this.loading = false;
                });
            },
            commitsPrevPage: function () {
                if (this.currentRepo.page > 1) {
                    let page = this.currentRepo.page - 1;
                    this.setNetworkStarted();
                    axios({
                        method: "GET",
                        url: backendUrl + "/list-repo-commits?login=" + this.currentRepo.author + "&repoName=" + this.currentRepo.name + "&page=" + page,
                    }).then(response => {
                        this.currentRepo.page--;
                        this.commitList = response.data;
                        this.nextPageError = false;
                        this.loading = false;
                    }, error => {
                        this.errorText = error.message;
                        this.loading = false;
                    });
                }
            },
            importRepoCommits: function (repoName, owner) {
                this.setNetworkStarted();
                axios({
                    method: "POST",
                    data: {
                        repoName: repoName,
                        repoLogin: owner
                    },
                    url: backendUrl + "/import-repo"
                }).then(response => {
                    this.messageText = response.data;
                    this.loading = false;
                }, error => {
                    this.errorText = error.message;
                    this.loading = false;
                });
            },
            deleteRepoCommits: function (repoName, owner) {
                this.setNetworkStarted();
                axios({
                    method: "POST",
                    data: {
                        repoName: repoName,
                        repoLogin: owner
                    },
                    url: backendUrl + "/delete-repo-commits"
                }).then(response => {
                    this.messageText = response.data;
                    this.loading = false;
                }, error => {
                    this.errorText = error.message;
                    this.loading = false;
                });
            },
            createRepo: function () {
                this.setNetworkStarted();
                axios({
                    method: "POST",
                    data: {
                        repoName: this.newRepoName,
                    },
                    url: backendUrl + "/create-repo"
                }).then(response => {
                    this.messageText = 'repo created';
                    this.loading = false;
                    this.refreshRepoList();
                }, error => {
                    this.errorText = error.message;
                    this.loading = false;
                });
            }
        }
    }

</script>
