import { Tag } from "../models/tag.model.js";

async function handleTags(tagsArray = []) {

    if (!Array.isArray(tagsArray)) {
        return [];
    }

    const cleanTags = tagsArray.map(tag =>
        tag.trim().toLowerCase()
    );

    for (const tag of cleanTags) {
        const existingTag = await Tag.findOne({ name: tag });

        if (existingTag) {
            existingTag.usageCount += 1;
            await existingTag.save();
        } else {
            await Tag.create({
                name: tag,
                usageCount: 1
            });
        }
    }

    return cleanTags;
}

export { handleTags };
