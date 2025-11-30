import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Comment } from "../../types/post";
interface CommentProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentProps) {
  const [userImage, setUserImage] = useState<string>("");

  const retrieveCommentUserImage = async (username: string) => {
    const response = await fetch(`https://pdm-backend-1sg4.onrender.com/usuarios/${username}`);
    const json = await response.json();
    if (response.ok) {
      setUserImage(json.usuario.avatar_url);
    } else {
      console.error("Failed to fetch user image for comment");
    }
  };

  useEffect(() => {
    retrieveCommentUserImage(comment.username);
  }, [comment.username]);

  return (
    <View className="border-t border-gray-300 py-2 w-full px-4 flex-row">
      <View className="mr-3">
        <Image
          source={{ uri: userImage || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" }}
          className="w-10 h-10 rounded-full"
        />
      </View>
      <View>
        <Text className="font-semibold text-base">{comment.username}</Text>
        <Text className="text-gray-500 text-sm">
          {new Date(comment.created_at).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text className="text-gray-800">{comment.comment}</Text>
      </View>
    </View>
  );
}
