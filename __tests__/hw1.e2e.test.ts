import {agent as supertest} from "supertest";
import {app} from "../src/settings";


const  req = supertest(app)

describe('/videos',()=>{

    beforeAll(async ()=>{
        await req
            .delete ('/testing/all-data')
    })
    afterAll(async ()=>{

    })
    it('get content',async ()=>{
        const res = await req
            .get('/videos')

        expect(res.body).toEqual([])
        console.log(res.body)
    })

    it('- POST does not create the video with incorrect data (no title, no author)', async ()=> {
        const res =await req
            .post('/videos')
            .send({ title: '', author: '' })

        expect(res.body).toEqual({  errorsMessages: [
                { message: 'Incorrect title', field: 'title' },
                { message: 'Incorrect author', field: 'author' },
            ]})


        const getRes = await req.get('/videos/')
        expect(getRes.body).toEqual([])
    })

let idVideo:number
    it('POST create video',async ()=>{
        const res =await req
            .post('/videos')
            .send({ title: 'TTTTT', author: 'AAuthor' })
            .expect(201)
        console.log(res.body)
        idVideo=res.body.id
        expect(res.body.author).toEqual('AAuthor')
    })

    it('Get video bu correct id',async ()=>{
        await req
            .get('/videos/' + idVideo)
            .expect(200)
    })
})