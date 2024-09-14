import Int "mo:base/Int";

import Array "mo:base/Array";
import Time "mo:base/Time";
import List "mo:base/List";
import Text "mo:base/Text";

actor {
  public type Post = {
    title: Text;
    body: Text;
    author: Text;
    timestamp: Int;
    category: Text;
  };

  stable var posts : List.List<Post> = List.nil();

  public func createPost(title: Text, body: Text, author: Text, category: Text) : async () {
    let newPost : Post = {
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
      category = category;
    };
    posts := List.push(newPost, posts);
  };

  public query func getPosts(category: Text) : async [Post] {
    let filteredPosts = List.filter<Post>(posts, func(post) { post.category == category });
    List.toArray(filteredPosts)
  };

  public query func getCategories() : async [Text] {
    ["Red Team", "Pen Testing", "Exploit Dev", "Cryptography", "Social Engineering", "CTF"]
  };
}