import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import appwriteService from "../appWrite/configure";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./Loading";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData); // Check userData for authentication

  const submit = async (data) => {
    setLoading(true);
    try {
      // Ensure user is authenticated before submitting the form
      if (!userData?.$id) {
        throw new Error("User is not authenticated. Please log in.");
      }

      let file = null;

      // Check if an image was uploaded
      if (data.image && data.image.length > 0) {
        file = await appwriteService.uploadFile(data.image[0]);

        // Delete the old image if it exists and a new image is uploaded
        if (file && post && post.featuredImage) {
          await appwriteService.deleteFile(post.featuredImage);
        }
      }

      let dbPost;

      // If updating a post
      if (post) {
        dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : post.featuredImage, // Keep old image if no new file
        });
      } else {
        // If creating a new post
        data.featuredImage = file ? file.$id : undefined;

        // Create the post and include user ID
        dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id, // Assign userId to the post
        });
      }

      // If the post was created/updated successfully, navigate to the post page
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } catch (err) {
      console.error("Error handling post:", err);
      setError(err.message || "An error occurred while processing the post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Slug transformation helper
  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s+/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  // Render loading screen while the form is being submitted
  if (loading) {
    return <Loading />;
  }

  // Render error message if something goes wrong
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Render the form
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title:"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug:"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
          }}
        />
        <RTE
          label="Content:"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image:"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          required={!post} // Required only for new posts
          {...register("image")}
        />
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
