import React from 'react';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Calendar,
  TrendingUp,
  Clock,
  Award,
  Users
} from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const DashboardPage: React.FC = () => {
  const stats = [
    {
      name: 'Daily Streak',
      value: '12',
      icon: Target,
      color: 'text-success-600',
      bgColor: 'bg-success-100'
    },
    {
      name: 'Total Points',
      value: '2,450',
      icon: Award,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100'
    },
    {
      name: 'Questions Solved',
      value: '128',
      icon: BookOpen,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      name: 'Global Rank',
      value: '#45',
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const recentActivity = [
    {
      type: 'practice',
      title: 'Completed Mathematics Practice Set',
      time: '2 hours ago',
      score: '85%'
    },
    {
      type: 'contest',
      title: 'Participated in Physics Contest',
      time: '1 day ago',
      score: '12th place'
    },
    {
      type: 'daily',
      title: 'Solved Daily Question',
      time: '2 days ago',
      score: 'Correct'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Chemistry Live Exam',
      date: 'Tomorrow, 3:00 PM',
      participants: 156
    },
    {
      title: 'Weekly Mathematics Contest',
      date: 'Friday, 2:00 PM',
      participants: 892
    },
    {
      title: 'Physics Study Group',
      date: 'Saturday, 10:00 AM',
      participants: 24
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600">Welcome back! Here's your learning progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardBody className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Challenge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Today's Challenge
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <h4 className="font-medium text-primary-900">Daily Mathematics Question</h4>
                <p className="text-sm text-primary-700 mt-1">
                  Solve today's featured problem and maintain your streak!
                </p>
                <div className="mt-3">
                  <Button size="sm" variant="primary">
                    Start Challenge
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-secondary-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>Time remaining: 14h 32m</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-secondary-500">{activity.time}</p>
                  </div>
                  <span className="text-sm font-medium text-primary-600">
                    {activity.score}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                  <h4 className="font-medium text-secondary-900">{event.title}</h4>
                  <p className="text-sm text-secondary-600">{event.date}</p>
                  <div className="flex items-center mt-1 text-xs text-secondary-500">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{event.participants} participants</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <BookOpen className="h-6 w-6 mb-2" />
              Practice Problems
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Live Exams
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Trophy className="h-6 w-6 mb-2" />
              Contests
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Users className="h-6 w-6 mb-2" />
              Study Groups
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};