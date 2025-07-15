import { Tag } from "../models/tag.model.js";

async function handleTags(tagsArray) {
    const cleanTags = tagsArray.map(tag => 
        tag.trim().toLowerCase()
    )

    for (let tag of tagsArray) {

        const existingTag = await Tag.findOne({ name: tag })

        if (existingTag) {
            existingTag.usageCount += 1
            await existingTag.save()
        } else {
            await Tag.create({ name: tag })
        }
    }

    return cleanTags
}

export { handleTags }