import express, {Request, Response} from 'express'

export const app = express()


app.use(express.json())


enum AvailableResolutions {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160'
}

type Video = {
    id?: number;
    title?: string;
    author?: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    createdAt?: string;
    publicationDate?: string;
    availableResolutions?: AvailableResolutions[];
}

const videos: Video[] = [
    {
        "id": 0,
        "title": "video interesting",
        "author": "man",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2024-02-01T18:57:08.689Z",
        "publicationDate": "2024-02-01T18:57:08.689Z",
        "availableResolutions": [AvailableResolutions.P144]
    }
]

type RequestWithParams<P> = Request<P, unknown, unknown, unknown>
type Param = {
    id: number
}

type RequestWithBody<B> = Request<unknown, unknown, B, unknown>
type CreateVideo = {
    title: string,
    author: string,
    availableResolutions?: AvailableResolutions[]
}

type RequestWithParamsWithBody<P, B> = Request<P, unknown, B, unknown>
type PutVideo = {
    title: string,
    author: string,
    availableResolutions?: AvailableResolutions[]
    canBeDownloaded?: boolean,
    minAgeRestriction?: number,//maximum: 18   minimum: 1
    publicationDate?: string
}

type ErrorsMessage = {
    message: string,
    field: string
}
type ErrorType = { errorsMessages: ErrorsMessage[] }


app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos)
})


app.post('/videos', (req: RequestWithBody<CreateVideo>, res: Response) => {
    const errors: ErrorType = {errorsMessages: []}
    let {title, author, availableResolutions} = req.body
    if (!title || !title.trim() || typeof title !== 'string' || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'Incorrect title', field: 'title'})
    }
    if (!author || !author.trim() || typeof author !== 'string' || author.trim().length > 20) {
        errors.errorsMessages.push({message: 'Incorrect author', field: 'author'})
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.forEach(e => {
            if (!(e in AvailableResolutions)) {
                errors.errorsMessages.push({message: 'Incorrect availableResolutions', field: 'availableResolutions'})
                return
            }
        })
    } else {
        availableResolutions = []
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    const createdAt = new Date()
    const publicationDate = new Date()

    const newVideo: Video = {
        id: +(new Date()),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions
    }

    videos.push(newVideo)

    res.status(201).send(newVideo)
})


app.get('/videos/:id', (req: RequestWithParams<Param>, res: Response) => {
    let video = videos.find(e => e.id === +req.params.id)
    if (video) {
        res.status(200).send(video)
    } else {
        res.sendStatus(404)
    }

})

app.put('/videos/:id', (req: RequestWithParamsWithBody<Param, PutVideo>, res: Response) => {
    const errors: ErrorType = {errorsMessages: []}
    let {title, author, availableResolutions, minAgeRestriction, canBeDownloaded, publicationDate} = req.body
    if (!title || !title.trim() || typeof title !== 'string' || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'Incorrect title', field: 'title'})
    }
    if (!author || !author.trim() || typeof author !== 'string' || author.trim().length > 20) {
        errors.errorsMessages.push({message: 'Incorrect author', field: 'author'})
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.forEach(e => {
            if (!(e in AvailableResolutions)) {
                errors.errorsMessages.push({message: 'Incorrect availableResolutions', field: 'availableResolutions'})
                return
            }
        })
    } else {
        availableResolutions = []
    }
    if (minAgeRestriction) {
        if (minAgeRestriction < 1 || minAgeRestriction > 18) {
            errors.errorsMessages.push({message: 'min1,max 18', field: 'minAgeRestriction'})
        }
    }
    if(canBeDownloaded){
        if(typeof canBeDownloaded!=="boolean"){
            errors.errorsMessages.push({message: 'boolean value', field: 'canBeDownloaded'})
        }
    }

    if(publicationDate){
        if(typeof publicationDate!=="string"){
            errors.errorsMessages.push({message: 'Date value, type string', field: 'publicationDate'})
        }
    }


    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    let video = videos.find(e => e.id === +req.params.id)
    if (video) {
        video.title = title
        video.author = author
        if (availableResolutions) {
            video.availableResolutions = availableResolutions
        }
        if (canBeDownloaded) {
            video.canBeDownloaded = canBeDownloaded
        }
        if (minAgeRestriction) {
            video.minAgeRestriction = minAgeRestriction
        }
        if (publicationDate) {
            video.publicationDate = publicationDate
        }
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }


})


app.delete('/videos/:id', (req: RequestWithParams<Param>, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1)
            res.sendStatus(204)
            return
        }
    }
    res.sendStatus(404)
})


app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos.length = 0
    res.sendStatus(204)
})