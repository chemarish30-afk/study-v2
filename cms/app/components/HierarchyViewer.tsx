'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ExamCard } from './ExamCard'
import { CourseCard } from './CourseCard'
import { LoadingSpinner } from './LoadingSpinner'

interface Exam {
  id: number
  title: string
  description: string
  year: number
  subjects: Subject[]
}

interface Course {
  id: number
  title: string
  description: string
  duration: string
  subjects: Subject[]
}

interface Subject {
  id: number
  title: string
  description: string
  units: Unit[]
}

interface Unit {
  id: number
  title: string
  description: string
  chapters: Chapter[]
}

interface Chapter {
  id: number
  title: string
  description: string
  modules: Module[]
}

interface Module {
  id: number
  title: string
  description: string
  module_contents: ModuleContent[]
}

interface ModuleContent {
  id: number
  position: number
  contentType: 'paragraph' | 'table' | 'image' | 'mcq'
  paragraph?: Paragraph
  table?: Table
  image?: Image
  mcq?: MCQ
}

interface Paragraph {
  id: number
  content: string
}

interface Table {
  id: number
  content: string
  caption?: string
}

interface Image {
  id: number
  file: {
    url: string
    alternativeText?: string
  }
  caption?: string
  altText: string
}

interface MCQ {
  id: number
  question: string
  choices: string[]
  correctAnswer: string
  feedback?: string
}

export function HierarchyViewer() {
  const { data: session } = useSession()
  const [exams, setExams] = useState<Exam[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.jwt) {
      fetchHierarchy()
    }
  }, [session])

  const fetchHierarchy = async () => {
    try {
      setLoading(true)
      
      const [examsResponse, coursesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exams?populate=*`, {
          headers: {
            'Authorization': `Bearer ${session?.jwt}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/courses?populate=*`, {
          headers: {
            'Authorization': `Bearer ${session?.jwt}`,
            'Content-Type': 'application/json',
          },
        }),
      ])

      if (!examsResponse.ok || !coursesResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const examsData = await examsResponse.json()
      const coursesData = await coursesResponse.json()

      setExams(examsData.data || [])
      setCourses(coursesData.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={fetchHierarchy}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Educational Content Hierarchy
        </h1>
        <p className="text-gray-600">
          Browse through exams and courses with their complete content structure
        </p>
      </div>

      {exams.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Exams</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </section>
      )}

      {courses.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Courses</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {exams.length === 0 && courses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No content available</div>
          <p className="text-sm text-gray-400">
            Contact your administrator to add educational content
          </p>
        </div>
      )}
    </div>
  )
}
