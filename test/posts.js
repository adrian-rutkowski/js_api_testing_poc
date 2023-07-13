import supertest from "supertest";
import { expect } from "chai";

const request = supertest('https://jsonplaceholder.typicode.com/');
const headers = {'Content-type': 'application/json; charset=UTF-8'};
let randomId = Math.floor(Math.random() * 100) + 1;
const OK_200 = 200
const CREATED_201 = 201

describe('GET /posts', () => {

    // using callback function 'done'
    it('should return a non-empty response body', (done) => {
        request.get('posts').end((err, res) => {
            expect(res.body).to.not.be.empty;
            done();
        })
    });

    // using .then to handle the returned Promise
    it('should return an array', () => {
        return request.get('posts').then((res) => {
            expect(res.body).to.be.an('array');
        })
    });

    // using async await
    it('should return a status code of 200', async () => {
        const res = await request.get('posts');
        expect(res.statusCode).to.equal(OK_200);
    });
})

describe('GET /posts/:id', () => {
    it('should return details of the post and response code 200', () => {
        console.log(randomId)
        return request.get(`posts/${randomId}`).then((res) => {
            expect(res.body).to.not.be.empty;
            expect(res.statusCode).to.equal(OK_200);
            expect(res.body.id).to.equal(randomId);
        })
    })
})

describe('POST /posts', () => {
    it('should create a new post', async () => {
        const payload = {userId: randomId, title: "js poc post title", body: "js poc post body"}
        const res = await request.post('posts')
                                .set(headers)
                                .send(payload)
        console.log(res.body)
        expect(res.statusCode).to.equal(CREATED_201);
        expect(res.body).to.contain.keys(['userId', 'title', 'body', 'id'])
        expect(res.body.userId).to.eq(payload.userId)
        expect(res.body).to.deep.include(payload)
    })
})

describe('PUT /posts/:id', () => {
    it('should update an existing post', async () => {
        const postId = 29
        const payload = {id: postId, userId: randomId, title: "updated title", body: "updated body"}
        
        const res = await request.put(`posts/${postId}`)
                                .set(headers)
                                .send(payload)
        console.log(res.body)
        expect(res.statusCode).to.equal(OK_200);
        expect(res.body).to.contain.keys(['userId', 'title', 'body', 'id'])
        expect(res.body.userId).to.eq(payload.userId)
        expect(res.body).to.deep.include(payload)
    })
})

describe('DELETE /posts/:id', () => {
    it.only('should delete an existing post', async () => {
        const postId = 29        
        const res = await request.delete(`posts/${postId}`)
        console.log(res.body)
        expect(res.statusCode).to.equal(OK_200);
    })
})
