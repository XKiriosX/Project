"use strict";

var Dom = (function() {
    var wall = document.getElementById("wall");

    var user = "Admin";


    function createDivPost(photoPost)
    {
        var divPost       = document.createElement("div");
        divPost.className = "post";
        divPost.setAttribute("id", photoPost.id);

        return divPost;
    }

    function createDivHashtags(photoPost)
    {
        var divHashtags       = document.createElement("div");
        divHashtags.className = "hashtags";

        var pHashtagsText = document.createElement("p");

        var text = "";
        for(let i = 0; i < photoPost.hashtags.length - 1; i++)
        {
            text += photoPost.hashtags[i] + ", "
        }
        text += photoPost.hashtags[photoPost.hashtags.length - 1];

        pHashtagsText.innerHTML = text;

        divHashtags.appendChild(pHashtagsText);

        return divHashtags;
    }

    function createDivMenu(photoPost)
    {
        var divMenuBlock       = document.createElement("div");
        divMenuBlock.className = "menu-block";
        divMenuBlock.innerHTML = "Menu";

        var divMenuDrop       = document.createElement("div");
        divMenuDrop.className = "menu-dropdown";

        var aEdit         = document.createElement("a");
        var aDelete       = document.createElement("a");
        aEdit.className   = "menu-element";
        aDelete.className = "menu-element";
        aEdit.setAttribute("href", "#");
        aDelete.setAttribute("href", "#");
        aEdit.innerHTML   = "Edit";
        aDelete.innerHTML = "Delete";

        divMenuDrop.appendChild(aEdit);
        divMenuDrop.appendChild(aDelete);

        divMenuBlock.appendChild(divMenuDrop);

        return divMenuBlock;
    }

    function createDivPostImageBlock(photoPost)
    {
        var divPostImageBlock       = document.createElement("div");
        divPostImageBlock.className = "post-image-block";
        divPostImageBlock.setAttribute("likes", photoPost.liked.length);

        var imgPostImage = document.createElement("img");
        imgPostImage.setAttribute("src", photoPost.photoLink);

        divPostImageBlock.appendChild(imgPostImage);

        return divPostImageBlock;
    }

    function createDivDescription(photoPost)
    {
        var divDescription       = document.createElement("div");
        divDescription.className = "description";
        var pDescription = document.createElement("p");
        pDescription.innerHTML      = photoPost.description;

        divDescription.appendChild(pDescription);

        return divDescription;
    }

    function createDivAuthorDate(photoPost)
    {
        var divAuthorDate       = document.createElement("div");
        divAuthorDate.className = "author-date";
        var pAuthorDate         = document.createElement("p");
        pAuthorDate.innerHTML   = "Added by " + photoPost.author + " at " + 
            photoPost.createdAt.getDay() + "." + 
            photoPost.createdAt.getMonth() + "." + 
            photoPost.createdAt.getFullYear();

        divAuthorDate.appendChild(pAuthorDate);

        return divAuthorDate;
    }

    function createDivLike(photoPost)
    {
        var divLike = document.createElement("div");
            divLike.className = "like";

        var imgLike = document.createElement("img");
            imgLike.setAttribute("src", "pictures/like.png");

        divLike.appendChild(imgLike);

        return divLike;
    }

    function createNewPost(photoPost)
    {
        var divPost = createDivPost(photoPost);
        
        if(photoPost.hashtags.length > 0)
        {
            divPost.appendChild(createDivHashtags(photoPost));
        }
        
        if(user && user == photoPost.author)
        {
            divPost.appendChild(createDivMenu(photoPost));
        }

        divPost.appendChild(createDivPostImageBlock(photoPost));

        if(photoPost.description.length > 0)
        {
            divPost.appendChild(createDivDescription(photoPost));
        }

        divPost.appendChild(createDivAuthorDate(photoPost));

        if(user)
        {
            divPost.appendChild(createDivLike(photoPost));
        }

        return divPost;
    }

    function showPhotoPost(photoPost) 
    {
        wall.appendChild(createNewPost(photoPost));
    }


    function showPhotoPosts(skip, top, filter)
    {
        var posts = Post.getPhotoPosts(skip, top, filter);

        wall.innerHTML = "";
        for(let post of posts)
        {
            showPhotoPost(post);
        }
    }

    
    function addPhotoPost(photoPost) 
    {
        if(Post.addPhotoPost(photoPost))
        {
            showPhotoPost(photoPost);
            return true;
        }
        return false;
    }

    
    function removePhotoPost(id) 
    {
        if(Post.removePhotoPost(id))
        {
            wall.removeChild(document.getElementById(id));
            return true;
        }
        return false;
    }

    
    function editPhotoPost(id, photoPost) 
    {
        if(Post.editPhotoPost(id, photoPost))
        {
            wall.replaceChild(createNewPost(Post.getPhotoPost(id)), document.getElementById(id));
            return true;
        }
        return false;
    }

    function showUserElements()
    {
        var divAccount       = document.createElement("div");
        divAccount.className = "account-info";

        var pInfo = document.createElement("p");

        var button = document.createElement("button");
        button.className = "log-button";

        if(user === null || typeof user === "undefined")
        {
            pInfo.innerHTML  = "<solid>Account: Guest</solid>";
            button.innerHTML = "log in";
        }
        else
        {
            pInfo.innerHTML = "<solid>Account: " + user +"</solid>";
            button.innerHTML = "log out";
        }

        divAccount.appendChild(pInfo);
        divAccount.appendChild(button);

        var header = document.getElementById("header");
        header.appendChild(divAccount);
    }  

    showUserElements();

    return {
        showPhotoPosts,
        editPhotoPost,
        removePhotoPost,
        addPhotoPost,
    };
})();