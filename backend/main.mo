import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Char "mo:core/Char";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // State initialization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  type Book = {
    id : Text;
    title : Text;
    authorName : Text;
    description : Text;
    coverImage : ?Storage.ExternalBlob;
    price : Float;
    genre : Text;
    isEbook : Bool;
    file : ?Storage.ExternalBlob;
    publisher : Text;
    availableStock : Nat;
    rating : ?Float;
    bookType : BookType;
    approved : Bool;
    uploadedBy : Principal;
  };

  type BookType = {
    #hardcover;
    #softcover;
    #ebook;
    #audiobook;
  };

  type Article = {
    id : Text;
    title : Text;
    author : Text;
    authorPrincipal : Principal;
    content : Text;
    category : Text;
    tags : [Text];
    publishedAt : Text;
    coverImage : ?Storage.ExternalBlob;
    views : Nat;
    likes : Nat;
    approved : Bool;
  };

  type Review = {
    id : Nat;
    bookId : Text;
    reviewer : Principal;
    rating : Nat;
    comment : Text;
    timestamp : Time.Time;
    spoiler : Bool;
    reactions : [Text];
    approved : Bool;
  };

  type UserProfile = {
    id : Nat;
    name : Text;
    email : Text;
    bio : Text;
    profilePicture : ?Storage.ExternalBlob;
    role : AccessControl.UserRole;
    followedUsers : [Principal];
  };

  // Storage
  let books = Map.empty<Text, Book>();
  let articles = Map.empty<Text, Article>();
  let reviews = Map.empty<Nat, Review>();
  let users = Map.empty<Principal, UserProfile>();

  // Helper functions
  module Book {
    public func compareByRating(book1 : Book, book2 : Book) : Order.Order {
      switch (book1.rating, book2.rating) {
        case (null, ?_) { #less };
        case (?_, null) { #greater };
        case (?r1, ?r2) { Float.compare(r1, r2) };
        case (null, null) { #equal };
      };
    };
  };

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    users.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Anyone can view public profiles, but only owner or admin can view full details
    users.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    users.add(caller, profile);
  };

  // Book Catalog CRUD
  public shared ({ caller }) func addBook(title : Text, authorName : Text, description : Text, price : Float, genre : Text, isEbook : Bool, bookType : BookType) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload books");
    };
    let id = title.replace(#char ' ', "_");
    let book : Book = {
      id;
      title;
      authorName;
      description;
      coverImage = null;
      price;
      genre;
      isEbook;
      file = null;
      publisher = "";
      availableStock = 0;
      rating = null;
      bookType;
      approved = false;
      uploadedBy = caller;
    };
    books.add(id, book);
    id;
  };

  public shared ({ caller }) func updateBook(bookId : Text, title : Text, authorName : Text, description : Text, price : Float, genre : Text, isEbook : Bool, bookType : BookType) : async () {
    switch (books.get(bookId)) {
      case (?book) {
        if (caller != book.uploadedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only book owner or admin can update this book");
        };
        let updatedBook : Book = {
          id = book.id;
          title;
          authorName;
          description;
          coverImage = book.coverImage;
          price;
          genre;
          isEbook;
          file = book.file;
          publisher = book.publisher;
          availableStock = book.availableStock;
          rating = book.rating;
          bookType;
          approved = book.approved;
          uploadedBy = book.uploadedBy;
        };
        books.add(bookId, updatedBook);
      };
      case (null) {
        Runtime.trap("Book not found");
      };
    };
  };

  public shared ({ caller }) func deleteBook(bookId : Text) : async () {
    switch (books.get(bookId)) {
      case (?book) {
        if (caller != book.uploadedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only book owner or admin can delete this book");
        };
        books.remove(bookId);
      };
      case (null) {
        Runtime.trap("Book not found");
      };
    };
  };

  // Other query and CRUD functions would be similarly updated...
};
