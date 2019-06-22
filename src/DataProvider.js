import axios from 'axios';

export default class DataProvider{
    static getpigjiangCsv(){
        return axios.get('./data/pigjiang.csv')
    }

    static getMapJson() {

        //console.log(data)

        return axios.get('./data/china.json')
    }
}