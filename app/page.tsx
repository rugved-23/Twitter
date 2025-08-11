"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
  Search,
  Home,
  Bell,
  Mail,
  Bookmark,
  User,
  Settings,
  ImageIcon,
  Smile,
  Calendar,
  MapPin,
  Verified,
  LogOut,
  Send,
  X,
  Edit,
  Save,
  ArrowLeft,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth-modal"

interface Tweet {
  id: string
  userId: string
  user: {
    name: string
    username: string
    avatar: string
    verified?: boolean
  }
  content: string
  timestamp: string
  likes: number
  retweets: number
  comments: number
  liked: boolean
  retweeted: boolean
  bookmarked?: boolean
  image?: string
}

interface Notification {
  id: string
  type: "like" | "retweet" | "follow" | "mention"
  user: {
    name: string
    username: string
    avatar: string
  }
  content?: string
  timestamp: string
  read: boolean
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
}

interface Conversation {
  id: string
  user: {
    name: string
    username: string
    avatar: string
  }
  lastMessage: string
  timestamp: string
  unread: number
}

type ActivePage = "home" | "explore" | "notifications" | "messages" | "bookmarks" | "profile" | "settings"

export default function TwitterClone() {
  const { user, logout, followUser, unfollowUser, isFollowing } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(!user)
  const [activePage, setActivePage] = useState<ActivePage>("home")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  })

  const [tweets, setTweets] = useState<Tweet[]>([
    {
      id: "1",
      userId: "3",
      user: {
        name: "Sarah Johnson",
        username: "sarahj_dev",
        avatar: "/placeholder.svg?height=40&width=40&text=SJ",
        verified: true,
      },
      content:
        "Just shipped a new feature! The feeling when your code works perfectly on the first try is unmatched 🚀 #coding #webdev",
      timestamp: "2h",
      likes: 124,
      retweets: 23,
      comments: 8,
      liked: false,
      retweeted: false,
      bookmarked: false,
      image: "/placeholder.svg?height=300&width=500&text=Code+Screenshot",
    },
    {
      id: "2",
      userId: "4",
      user: {
        name: "Tech News Daily",
        username: "technewsdaily",
        avatar: "/placeholder.svg?height=40&width=40&text=TN",
        verified: true,
      },
      content:
        "BREAKING: New AI breakthrough promises to revolutionize how we interact with technology. This could change everything we know about human-computer interaction.",
      timestamp: "4h",
      likes: 892,
      retweets: 156,
      comments: 45,
      liked: true,
      retweeted: false,
      bookmarked: true,
    },
    {
      id: "3",
      userId: "5",
      user: {
        name: "Alex Chen",
        username: "alexchen_ux",
        avatar: "/placeholder.svg?height=40&width=40&text=AC",
      },
      content:
        "Beautiful sunset from my office window today. Sometimes you need to pause and appreciate the simple moments ✨",
      timestamp: "6h",
      likes: 67,
      retweets: 12,
      comments: 15,
      liked: false,
      retweeted: true,
      bookmarked: false,
      image: "/placeholder.svg?height=300&width=500&text=Sunset+View",
    },
  ])

  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      type: "like",
      user: { name: "Sarah Johnson", username: "sarahj_dev", avatar: "/placeholder.svg?height=40&width=40&text=SJ" },
      content: "liked your tweet about web development",
      timestamp: "2h",
      read: false,
    },
    {
      id: "2",
      type: "follow",
      user: { name: "Alex Chen", username: "alexchen_ux", avatar: "/placeholder.svg?height=40&width=40&text=AC" },
      timestamp: "4h",
      read: false,
    },
    {
      id: "3",
      type: "retweet",
      user: { name: "Jane Smith", username: "janesmith", avatar: "/placeholder.svg?height=40&width=40&text=JS" },
      content: "retweeted your post",
      timestamp: "1d",
      read: true,
    },
  ])

  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      user: { name: "Sarah Johnson", username: "sarahj_dev", avatar: "/placeholder.svg?height=40&width=40&text=SJ" },
      lastMessage: "Hey! Thanks for the follow. Love your content!",
      timestamp: "2h",
      unread: 2,
    },
    {
      id: "2",
      user: { name: "Alex Chen", username: "alexchen_ux", avatar: "/placeholder.svg?height=40&width=40&text=AC" },
      lastMessage: "That sunset photo was amazing!",
      timestamp: "1d",
      unread: 0,
    },
  ])

  const [messages] = useState<Message[]>([
    {
      id: "1",
      senderId: "3",
      receiverId: user?.id || "",
      content: "Hey! Thanks for the follow. Love your content!",
      timestamp: "2h",
      read: false,
    },
    {
      id: "2",
      senderId: user?.id || "",
      receiverId: "3",
      content: "Thanks! Your coding tips are really helpful too.",
      timestamp: "1h",
      read: true,
    },
  ])

  const [newTweet, setNewTweet] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock users for suggestions
  const suggestedUsers = [
    { id: "1", name: "John Doe", username: "johndoe", avatar: "/placeholder.svg?height=40&width=40&text=JD" },
    { id: "2", name: "Jane Smith", username: "janesmith", avatar: "/placeholder.svg?height=40&width=40&text=JS" },
  ]

  const handleLike = (tweetId: string) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setTweets(
      tweets.map((tweet) =>
        tweet.id === tweetId
          ? {
              ...tweet,
              liked: !tweet.liked,
              likes: tweet.liked ? tweet.likes - 1 : tweet.likes + 1,
            }
          : tweet,
      ),
    )
  }

  const handleBookmark = (tweetId: string) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setTweets(
      tweets.map((tweet) =>
        tweet.id === tweetId
          ? {
              ...tweet,
              bookmarked: !tweet.bookmarked,
            }
          : tweet,
      ),
    )
  }

  const handleRetweet = (tweetId: string) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setTweets(
      tweets.map((tweet) =>
        tweet.id === tweetId
          ? {
              ...tweet,
              retweeted: !tweet.retweeted,
              retweets: tweet.retweeted ? tweet.retweets - 1 : tweet.retweets + 1,
            }
          : tweet,
      ),
    )
  }

  const handleTweet = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (newTweet.trim()) {
      const tweet: Tweet = {
        id: Date.now().toString(),
        userId: user.id,
        user: {
          name: user.name,
          username: user.username,
          avatar: user.avatar,
        },
        content: newTweet,
        timestamp: "now",
        likes: 0,
        retweets: 0,
        comments: 0,
        liked: false,
        retweeted: false,
        bookmarked: false,
      }
      setTweets([tweet, ...tweets])
      setNewTweet("")
    }
  }

  const handleFollow = (userId: string) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (isFollowing(userId)) {
      unfollowUser(userId)
    } else {
      followUser(userId)
    }
  }

  const handleInteraction = (action: () => void) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    action()
  }

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile via API
    setIsEditingProfile(false)
  }

  const renderHomePage = () => (
    <>
      {/* Compose Tweet */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's happening?"
              value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
              className="bg-transparent border-none text-xl placeholder-gray-500 resize-none focus:ring-0"
              rows={3}
            />
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-4 text-blue-400">
                <ImageIcon className="h-5 w-5 cursor-pointer hover:bg-blue-900/20 rounded-full p-1 h-8 w-8" />
                <Smile className="h-5 w-5 cursor-pointer hover:bg-blue-900/20 rounded-full p-1 h-8 w-8" />
                <Calendar className="h-5 w-5 cursor-pointer hover:bg-blue-900/20 rounded-full p-1 h-8 w-8" />
                <MapPin className="h-5 w-5 cursor-pointer hover:bg-blue-900/20 rounded-full p-1 h-8 w-8" />
              </div>
              <Button
                onClick={handleTweet}
                disabled={!newTweet.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 rounded-full px-6"
              >
                Tweet
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tweet Feed */}
      <div>
        {tweets.map((tweet) => (
          <Card key={tweet.id} className="bg-transparent border-0 border-b border-gray-800 rounded-none">
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <Avatar>
                  <AvatarImage src={tweet.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {tweet.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-white">{tweet.user.name}</span>
                    {tweet.user.verified && <Verified className="h-4 w-4 text-blue-400 fill-current" />}
                    <span className="text-gray-500">@{tweet.user.username}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">{tweet.timestamp}</span>
                    <Button variant="ghost" size="sm" className="ml-auto text-gray-500 hover:bg-gray-900">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-white mb-3 leading-relaxed">{tweet.content}</p>

                  {tweet.image && (
                    <div className="mb-3 rounded-2xl overflow-hidden">
                      <img
                        src={tweet.image || "/placeholder.svg"}
                        alt="Tweet image"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex justify-between max-w-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleInteraction(() => {})}
                      className="text-gray-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-full"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {tweet.comments}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRetweet(tweet.id)}
                      className={`hover:bg-green-900/20 rounded-full ${
                        tweet.retweeted ? "text-green-400" : "text-gray-500 hover:text-green-400"
                      }`}
                    >
                      <Repeat2 className="h-4 w-4 mr-2" />
                      {tweet.retweets}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(tweet.id)}
                      className={`hover:bg-red-900/20 rounded-full ${
                        tweet.liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${tweet.liked ? "fill-current" : ""}`} />
                      {tweet.likes}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmark(tweet.id)}
                      className={`hover:bg-blue-900/20 rounded-full ${
                        tweet.bookmarked ? "text-blue-400" : "text-gray-500 hover:text-blue-400"
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 mr-2 ${tweet.bookmarked ? "fill-current" : ""}`} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleInteraction(() => {})}
                      className="text-gray-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-full"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )

  const renderExplorePage = () => (
    <div className="p-4">
      <div className="mb-6">
        <Input
          placeholder="Search for people, topics, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-900 border-gray-800 text-white text-lg py-3"
        />
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 mb-6">
          <TabsTrigger value="trending" className="text-white data-[state=active]:bg-blue-600">
            Trending
          </TabsTrigger>
          <TabsTrigger value="news" className="text-white data-[state=active]:bg-blue-600">
            News
          </TabsTrigger>
          <TabsTrigger value="sports" className="text-white data-[state=active]:bg-blue-600">
            Sports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-4">
          {[
            { topic: "AI Revolution", tweets: "125K", category: "Technology" },
            { topic: "Climate Change", tweets: "89K", category: "Environment" },
            { topic: "Space Exploration", tweets: "67K", category: "Science" },
            { topic: "Cryptocurrency", tweets: "45K", category: "Finance" },
          ].map((trend, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800 hover:bg-gray-800 cursor-pointer">
              <CardContent className="p-4">
                <p className="text-gray-500 text-sm">{trend.category} · Trending</p>
                <p className="font-bold text-white text-lg">{trend.topic}</p>
                <p className="text-gray-500 text-sm">{trend.tweets} Tweets</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          {[
            { title: "Breaking: Major Tech Announcement", source: "Tech News", time: "2h" },
            { title: "Global Economic Update", source: "Financial Times", time: "4h" },
            { title: "Scientific Breakthrough Discovered", source: "Science Daily", time: "6h" },
          ].map((news, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800 hover:bg-gray-800 cursor-pointer">
              <CardContent className="p-4">
                <p className="font-bold text-white">{news.title}</p>
                <p className="text-gray-500 text-sm">
                  {news.source} · {news.time}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sports" className="space-y-4">
          {[
            { event: "World Cup Finals", status: "Live", viewers: "2.5M" },
            { event: "NBA Championship", status: "Tonight 8PM", viewers: "1.8M" },
            { event: "Tennis Open", status: "Tomorrow", viewers: "900K" },
          ].map((sport, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800 hover:bg-gray-800 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{sport.event}</p>
                    <p className="text-gray-500 text-sm">{sport.status}</p>
                  </div>
                  <Badge variant="secondary" className="bg-red-600 text-white">
                    {sport.viewers} watching
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderNotificationsPage = () => (
    <div className="p-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900 mb-6">
          <TabsTrigger value="all" className="text-white data-[state=active]:bg-blue-600">
            All
          </TabsTrigger>
          <TabsTrigger value="mentions" className="text-white data-[state=active]:bg-blue-600">
            Mentions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`bg-transparent border-0 border-b border-gray-800 rounded-none ${!notification.read ? "bg-blue-900/10" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    {notification.type === "like" && <Heart className="h-6 w-6 text-red-500 fill-current" />}
                    {notification.type === "retweet" && <Repeat2 className="h-6 w-6 text-green-500" />}
                    {notification.type === "follow" && <User className="h-6 w-6 text-blue-500" />}
                    {notification.type === "mention" && <MessageCircle className="h-6 w-6 text-blue-500" />}
                  </div>

                  <Avatar className="flex-shrink-0">
                    <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {notification.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{notification.user.name}</span>
                      <span className="text-gray-500">@{notification.user.username}</span>
                      <span className="text-gray-500">·</span>
                      <span className="text-gray-500">{notification.timestamp}</span>
                    </div>

                    <p className="text-gray-300 mt-1">
                      {notification.type === "follow" && "started following you"}
                      {notification.type !== "follow" && notification.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="mentions" className="space-y-4">
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500">No mentions yet</p>
            <p className="text-gray-600 text-sm">When someone mentions you, you'll see it here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderMessagesPage = () => (
    <div className="flex h-full">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Messages</h3>
        </div>
        <div className="overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900 ${
                selectedConversation === conversation.id ? "bg-gray-900" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {conversation.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{conversation.user.name}</span>
                    <span className="text-gray-500 text-sm">{conversation.timestamp}</span>
                  </div>
                  <p className="text-gray-400 text-sm truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && <Badge className="bg-blue-500 text-white">{conversation.unread}</Badge>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 flex items-center space-x-3">
              <Avatar>
                <AvatarImage
                  src={conversations.find((c) => c.id === selectedConversation)?.user.avatar || "/placeholder.svg"}
                />
                <AvatarFallback>
                  {conversations
                    .find((c) => c.id === selectedConversation)
                    ?.user.name.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-white">
                  {conversations.find((c) => c.id === selectedConversation)?.user.name}
                </p>
                <p className="text-gray-500 text-sm">
                  @{conversations.find((c) => c.id === selectedConversation)?.user.username}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages
                .filter(
                  (m) =>
                    (m.senderId === selectedConversation && m.receiverId === user?.id) ||
                    (m.senderId === user?.id && m.receiverId === selectedConversation),
                )
                .map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        message.senderId === user?.id ? "bg-blue-500 text-white" : "bg-gray-800 text-white"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex space-x-2">
                <Input
                  placeholder="Start a new message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white flex-1"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newMessage.trim()) {
                      // Handle send message
                      setNewMessage("")
                    }
                  }}
                />
                <Button className="bg-blue-500 hover:bg-blue-600" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Mail className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500">Select a message</p>
              <p className="text-gray-600 text-sm">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderBookmarksPage = () => {
    const bookmarkedTweets = tweets.filter((tweet) => tweet.bookmarked)

    return (
      <div className="p-4">
        {bookmarkedTweets.length > 0 ? (
          <div className="space-y-4">
            {bookmarkedTweets.map((tweet) => (
              <Card key={tweet.id} className="bg-transparent border-0 border-b border-gray-800 rounded-none">
                <CardContent className="p-4">
                  <div className="flex space-x-3">
                    <Avatar>
                      <AvatarImage src={tweet.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {tweet.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-bold text-white">{tweet.user.name}</span>
                        {tweet.user.verified && <Verified className="h-4 w-4 text-blue-400 fill-current" />}
                        <span className="text-gray-500">@{tweet.user.username}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{tweet.timestamp}</span>
                      </div>
                      <p className="text-white mb-3 leading-relaxed">{tweet.content}</p>
                      {tweet.image && (
                        <div className="mb-3 rounded-2xl overflow-hidden">
                          <img
                            src={tweet.image || "/placeholder.svg"}
                            alt="Tweet image"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bookmark className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500">No bookmarks yet</p>
            <p className="text-gray-600 text-sm">When you bookmark tweets, they'll show up here</p>
          </div>
        )}
      </div>
    )
  }

  const renderProfilePage = () => (
    <div>
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="absolute -bottom-16 left-4">
          <Avatar className="w-32 h-32 border-4 border-black">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute top-4 right-4">
          <Button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            variant="outline"
            className="bg-black border-gray-600 text-white hover:bg-gray-900"
          >
            {isEditingProfile ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditingProfile ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 p-4">
        {isEditingProfile ? (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="bg-gray-900 border-gray-700 text-white"
                rows={3}
              />
            </div>
            <Button onClick={handleSaveProfile} className="bg-blue-500 hover:bg-blue-600">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-gray-500">@{user?.username}</p>
            <p className="text-white mt-2">{user?.bio || "No bio yet"}</p>
            <div className="flex space-x-4 mt-4 text-gray-500">
              <span>
                <strong className="text-white">{user?.following?.length || 0}</strong> Following
              </span>
              <span>
                <strong className="text-white">{user?.followers?.length || 0}</strong> Followers
              </span>
            </div>
          </div>
        )}

        {/* User's Tweets */}
        <div className="border-t border-gray-800">
          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-4">Your Tweets</h3>
            {tweets.filter((tweet) => tweet.userId === user?.id).length > 0 ? (
              tweets
                .filter((tweet) => tweet.userId === user?.id)
                .map((tweet) => (
                  <Card key={tweet.id} className="bg-transparent border-0 border-b border-gray-800 rounded-none mb-4">
                    <CardContent className="p-4">
                      <p className="text-white mb-3 leading-relaxed">{tweet.content}</p>
                      <div className="flex justify-between max-w-md text-gray-500">
                        <span>
                          <MessageCircle className="h-4 w-4 inline mr-1" />
                          {tweet.comments}
                        </span>
                        <span>
                          <Repeat2 className="h-4 w-4 inline mr-1" />
                          {tweet.retweets}
                        </span>
                        <span>
                          <Heart className="h-4 w-4 inline mr-1" />
                          {tweet.likes}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No tweets yet</p>
                <p className="text-gray-600 text-sm">When you post tweets, they'll show up here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettingsPage = () => (
    <div className="p-4">
      <div className="space-y-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Account Settings</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white">Email</span>
              <span className="text-gray-400">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Username</span>
              <span className="text-gray-400">@{user?.username}</span>
            </div>
            <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent">
              Change Password
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Privacy & Safety</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white">Private Account</span>
              <Button variant="outline" size="sm" className="border-gray-600 text-white bg-transparent">
                Off
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Two-factor Authentication</span>
              <Button variant="outline" size="sm" className="border-gray-600 text-white bg-transparent">
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Notifications</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white">Push Notifications</span>
              <Button variant="outline" size="sm" className="border-gray-600 text-white bg-transparent">
                On
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Email Notifications</span>
              <Button variant="outline" size="sm" className="border-gray-600 text-white bg-transparent">
                On
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-900/20 border-red-800">
          <CardHeader>
            <h3 className="text-lg font-bold text-red-400">Danger Zone</h3>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activePage) {
      case "home":
        return renderHomePage()
      case "explore":
        return renderExplorePage()
      case "notifications":
        return renderNotificationsPage()
      case "messages":
        return renderMessagesPage()
      case "bookmarks":
        return renderBookmarksPage()
      case "profile":
        return renderProfilePage()
      case "settings":
        return renderSettingsPage()
      default:
        return renderHomePage()
    }
  }

  const getPageTitle = () => {
    switch (activePage) {
      case "home":
        return "Home"
      case "explore":
        return "Explore"
      case "notifications":
        return "Notifications"
      case "messages":
        return "Messages"
      case "bookmarks":
        return "Bookmarks"
      case "profile":
        return "Profile"
      case "settings":
        return "Settings"
      default:
        return "Home"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-400 mb-4">Welcome to Twitter</h1>
          <p className="text-gray-400 mb-8">Join the conversation and connect with people around the world</p>
          <Button onClick={() => setShowAuthModal(true)} className="bg-blue-500 hover:bg-blue-600 px-8 py-3 text-lg">
            Get Started
          </Button>
        </div>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar */}
        <div className="w-64 p-4 fixed h-full border-r border-gray-800">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-400">Twitter</h1>
          </div>

          <nav className="space-y-2">
            {[
              { icon: Home, label: "Home", page: "home" as ActivePage },
              { icon: Search, label: "Explore", page: "explore" as ActivePage },
              {
                icon: Bell,
                label: "Notifications",
                page: "notifications" as ActivePage,
                badge: notifications.filter((n) => !n.read).length,
              },
              {
                icon: Mail,
                label: "Messages",
                page: "messages" as ActivePage,
                badge: conversations.reduce((acc, conv) => acc + conv.unread, 0),
              },
              { icon: Bookmark, label: "Bookmarks", page: "bookmarks" as ActivePage },
              { icon: User, label: "Profile", page: "profile" as ActivePage },
              { icon: Settings, label: "Settings", page: "settings" as ActivePage },
            ].map((item) => (
              <Button
                key={item.label}
                variant={activePage === item.page ? "secondary" : "ghost"}
                onClick={() => setActivePage(item.page)}
                className={`w-full justify-start text-xl py-6 relative ${
                  activePage === item.page ? "bg-blue-900/20 text-blue-400" : "text-white hover:bg-gray-900"
                }`}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.label}
                {item.badge && item.badge > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white text-xs">
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>

          <Button className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full">
            Tweet
          </Button>

          {/* User Profile Section */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-900 rounded-full cursor-pointer">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-white text-sm">{user.name}</p>
                  <p className="text-gray-500 text-sm">@{user.username}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-gray-500 hover:text-red-500">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 border-r border-gray-800">
          {/* Header */}
          <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4">
            <div className="flex items-center space-x-4">
              {activePage !== "home" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivePage("home")}
                  className="text-white hover:bg-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <h2 className="text-xl font-bold">{getPageTitle()}</h2>
            </div>
          </div>

          {/* Page Content */}
          <div className="min-h-screen">{renderContent()}</div>
        </div>

        {/* Right Sidebar - Only show on home and explore pages */}
        {(activePage === "home" || activePage === "explore") && (
          <div className="w-80 p-4">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input placeholder="Search Twitter" className="bg-gray-900 border-gray-800 pl-10 rounded-full" />
              </div>
            </div>

            {/* Trending */}
            <Card className="bg-gray-900 border-gray-800 mb-6">
              <CardHeader>
                <h3 className="text-xl font-bold text-white">What's happening</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { category: "Technology", topic: "AI Revolution", tweets: "125K" },
                  { category: "Sports", topic: "World Cup", tweets: "89K" },
                  { category: "Entertainment", topic: "New Movie Release", tweets: "67K" },
                ].map((trend, index) => (
                  <div key={index} className="cursor-pointer hover:bg-gray-800 p-2 rounded">
                    <p className="text-gray-500 text-sm">{trend.category} · Trending</p>
                    <p className="font-bold text-white">{trend.topic}</p>
                    <p className="text-gray-500 text-sm">{trend.tweets} Tweets</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Who to follow */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <h3 className="text-xl font-bold text-white">Who to follow</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedUsers
                  .filter((suggestedUser) => suggestedUser.id !== user?.id)
                  .map((suggestedUser) => (
                    <div key={suggestedUser.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={suggestedUser.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {suggestedUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-white">{suggestedUser.name}</p>
                          <p className="text-gray-500">@{suggestedUser.username}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleFollow(suggestedUser.id)}
                        className={
                          isFollowing(suggestedUser.id)
                            ? "bg-transparent border border-gray-600 text-white hover:bg-red-600 hover:border-red-600 rounded-full px-4"
                            : "bg-white text-black hover:bg-gray-200 rounded-full px-4"
                        }
                      >
                        {isFollowing(suggestedUser.id) ? "Unfollow" : "Follow"}
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}
