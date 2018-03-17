"use strict"

;var PostWork = (function()
{
    var posts = 
    [
        {
            id: "0",
            description: "",
            createdAt: new Date(2018, 2, 22),
            author: "aaa",
            photoLink: "",
            hashtags: ["#pepe", "#very-rare-pepe"],
            liked: ["admin"],
            deleted: false,
        }
    ];

    function checkNumberParam(param, defaultValue)
    {
        if(typeof param != "number")
        {
            return defaultValue;
        }
        return param;
    }

    function checkIntervalsArray(intervals)
    {
        var result;
        var left;
        var right;

        result = [];
        for(let i = 0; i < intervals.length; i++)
        {
            if(Array.isArray(intervals[i]))
            {
                if( intervals[i][0] instanceof Date &&
                    intervals[i][1] instanceof Date)
                {
                    result.push(intervals[i]);
                }
            }
            else if(intervals[i] instanceof Date)
            {
                left = intervals[i];
                left.setHours(0);
                left.setMinutes(0);
                left.setSeconds(0);
                left.setMilliseconds(0);

                right = new Date(left.getTime() + 86400000);

                result.push([left, right]);
            }
        }
        return result;
    }

    function getPhotoPosts(skip, top, filter)
    {
        var result;

        skip = checkNumberParam(skip, 0);
        top  = checkNumberParam(top, 10);
        top = top >= 0 ? top : 10;

        if(!filter)
        {
            result = posts.slice(skip, skip + top);    
        }
        else
        {
            if ("authors" in filter && Array.isArray(filter.authors)) 
            {
                result = posts.filter(function(post) 
                {
                    return !post.deleted && filter.authors.indexOf(post.author) != -1;
                });
            }

            if ("intervals" in filter && Array.isArray(filter.intervals)) 
            {
                filter.intervals = checkIntervalsArray(filter.intervals);

                result = posts.filter(function(post)
                {
                    for(let interval of filter.intervals)
                    {
                        if( !post.deleted &&
                            interval[0].getTime() <= post.createdAt.getTime() && 
                            interval[1].getTime() >= post.createdAt.getTime())
                        {
                            return true;
                        }
                    }
                    return false;
                });
            }

            if ("hashtags" in filter && Array.isArray(filter.hashtags)) 
            {
                result = posts.filter(function(post) 
                {
                    for (let hashtag of post.hashtags)
                    {
                        if(!post.deleted && filter.hashtags.indexOf(hashtag) != -1)
                        {
                            return true;
                        }
                    }
                    return false;
                });
            }
        }

        return result;
    }


    function getPhotoPost(id)
    {
        return posts.find(function(post) 
        {
            return !post.deleted && post.id == id;
        });
    }


    function validatePhotoPost(postToCheck)
    {
        return "id" in postToCheck &&
               typeof postToCheck.id == "string" &&
               !posts.find(function(post){return postToCheck.id == post.id}) &&

               "description" in postToCheck &&
               typeof postToCheck.description == "string" &&
               postToCheck.description.length > 0 &&
               postToCheck.description.length <= 200 &&

               "author" in postToCheck &&
               typeof postToCheck.author == "string" && 
               postToCheck.author.length != 0 &&

               "photoLink" in postToCheck &&
               typeof postToCheck.photoLink == "string" && 

               "createdAt" in postToCheck &&
               postToCheck.createdAt instanceof Date && 
               postToCheck.createdAt.toString() != "Invalid Date" &&

               "hashtags" in postToCheck &&
               Array.isArray(postToCheck.hashtags) &&

               "liked" in postToCheck &&
               Array.isArray(postToCheck.liked) &&

               "deleted" in postToCheck &&
               typeof postToCheck.deleted == "boolean";
    }


    function addPhotoPost (post)
    {
        if (validatePhotoPost(post))
        {
            post.deleted = false;
            posts.push(post);
            return true
        }
        return false
    }


    function editPhotoPost(id, photoPost)
    {
        var toEdit;
        var temp;

        toEdit = getPhotoPost(id);
        if(toEdit)
        {
            if("description" in photoPost && 
                typeof photoPost.description == "string" &&
                photoPost.description.length > 0 &&
                photoPost.description.length <= 200)
            {
                toEdit.description = photoPost.description;
            }
            if("photoLink" in photoPost && typeof photoPost.photoLink == "string")
            {
                toEdit.photoLink = photoPost.photoLink;
            }
            if("hashtags" in photoPost && Array.isArray(photoPost.hashtags))
            {
                temp = [];
                for(let hashtag of photoPost.hashtags)
                {
                    if(typeof hashtag == "string" && hashtag.length > 1)
                    {
                        temp.push(hashtag);
                    }
                }
                toEdit.hashtags = temp;
            }

            return true;
        }
        return false;
    }

    function removePhotoPost(id)
    {
        var found;

        found = posts.findIndex(function(post){return post.id == id;});
        if(found != -1)
        {
            posts[found].deleted = true;
        }
    }
    
    function removePhotoPostHard(id) 
    {
        var found;

        found = posts.findIndex(function(post){return post.id == id;});
        if(found != -1)
        {
            posts.splice(found, 1);
        }
    }

    return {
        getPhotoPosts,
        getPhotoPost,
        validatePhotoPost,
        addPhotoPost,
        editPhotoPost,
        removePhotoPost,
        removePhotoPostHard,
    }
})();
    