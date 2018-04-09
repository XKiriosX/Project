'use strict'

;var Post = (function()
{
    var posts = 
    [
        {
            id: '0',
            description: 'JPEG',
            createdAt: new Date(2018, 2, 22),
            author: 'aaa',
            photoLink: 'https://im0-tub-by.yandex.net/i?id=31ee18c9d3061e6d4c8cc6a75ead9115&n=13',
            hashtags: ['#pepe', '#very-rare-pepe'],
            liked: ['admin'],
        }
    ];

    
    function getPhotoPosts(skip, top, filter)
    {
        function checkNumberParam(param, defaultValue)
        {
            if(typeof param !== 'number')
            {
                return defaultValue;
            }
            return param;
        }

        var result;

        skip = checkNumberParam(skip, 0);
        top  = checkNumberParam(top, 10);
        skip = (skip > -1 && skip < top) ? skip : 0; 

        if(!filter)
        {
            result = posts.slice(skip, top);    
        }
        else
        {
            if (Array.isArray(filter.authors)) 
            {
                result = posts.filter(function(post) 
                {
                    return filter.authors.indexOf(post.author) !== -1;
                });
            }

            if (filter.date instanceof Date) 
            {
                var left = new Date(filter.date);
                    left.setHours(0);
                    left.setMinutes(0);
                    left.setSeconds(0);
                    left.setMilliseconds(0);

                var right = new Date(left.getTime() + 86400000);

                result = posts.filter(function(post)
                {
                  return left.getTime() <= post.createdAt.getTime() && 
                         right.getTime() >= post.createdAt.getTime();
                });
            }

            if (Array.isArray(filter.hashtags)) 
            {
                result = posts.filter(function(post) 
                {
                    for (let hashtag of post.hashtags)
                    {
                        if(filter.hashtags.indexOf(hashtag) != -1)
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
            return post.id == id;
        });
    }


    function validatePhotoPost(postToCheck)
    {
      //
        return typeof postToCheck.id === 'string' &&
               !posts.find(function(post){return postToCheck.id === post.id}) &&

               typeof postToCheck.description === 'string' &&
               postToCheck.description.length <= 200 &&

               typeof postToCheck.author === 'string' && 
               postToCheck.author.length !== 0 &&

               typeof postToCheck.photoLink === 'string' && 

               postToCheck.createdAt instanceof Date && 
               postToCheck.createdAt.toString() !== 'Invalid Date' &&

               Array.isArray(postToCheck.hashtags) &&

               Array.isArray(postToCheck.liked);
    }


    function addPhotoPost (post)
    {
        if (validatePhotoPost(post))
        {
            posts.push(post);
            return true;
        }
        return false;
    }


    function editPhotoPost(id, photoPost)
    {
        var toEdit;
        var temp;

        toEdit = getPhotoPost(id);
        if(toEdit)
        {
            if( typeof photoPost.description === 'string' &&
                photoPost.description.length <= 200)
            {
                toEdit.description = photoPost.description;
            }
            if(typeof photoPost.photoLink === 'string')
            {
                toEdit.photoLink = photoPost.photoLink;
            }
            if(Array.isArray(photoPost.hashtags))
            {
                temp = [];

                for(let hashtag of photoPost.hashtags)
                {
                    if(typeof hashtag === 'string' && hashtag.length > 1)
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
        if(found !== -1)
        {
            posts.splice(found, 1);
            return true;
        }
        return false;
    }

    return {
        getPhotoPosts,
        getPhotoPost,
        addPhotoPost,
        editPhotoPost,
        removePhotoPost,
    }
})();
    