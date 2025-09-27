'use client'

import { useState } from 'react'

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

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<number>>(new Set())

  const toggleSubject = (subjectId: number) => {
    const newExpanded = new Set(expandedSubjects)
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId)
    } else {
      newExpanded.add(subjectId)
    }
    setExpandedSubjects(newExpanded)
  }

  const renderModuleContent = (content: ModuleContent) => {
    switch (content.contentType) {
      case 'paragraph':
        return content.paragraph ? (
          <div className="content-item">
            <div className="text-sm font-medium text-gray-700 mb-2">Paragraph</div>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: content.paragraph.content }}
            />
          </div>
        ) : null

      case 'table':
        return content.table ? (
          <div className="content-item">
            <div className="text-sm font-medium text-gray-700 mb-2">Table</div>
            {content.table.caption && (
              <div className="text-sm text-gray-600 mb-2 italic">{content.table.caption}</div>
            )}
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: content.table.content }}
            />
          </div>
        ) : null

      case 'image':
        return content.image ? (
          <div className="content-item">
            <div className="text-sm font-medium text-gray-700 mb-2">Image</div>
            <img
              src={content.image.file.url}
              alt={content.image.altText}
              className="max-w-full h-auto rounded-md"
            />
            {content.image.caption && (
              <div className="text-sm text-gray-600 mt-2 italic">{content.image.caption}</div>
            )}
          </div>
        ) : null

      case 'mcq':
        return content.mcq ? (
          <div className="content-item">
            <div className="text-sm font-medium text-gray-700 mb-2">Multiple Choice Question</div>
            <div className="font-medium mb-3">{content.mcq.question}</div>
            <div className="space-y-2">
              {content.mcq.choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{String.fromCharCode(65 + index)})</span>
                  <span className="text-sm">{choice}</span>
                  {choice === content.mcq.correctAnswer && (
                    <span className="text-green-600 text-sm font-medium">✓</span>
                  )}
                </div>
              ))}
            </div>
            {content.mcq.feedback && (
              <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
                <strong>Feedback:</strong> {content.mcq.feedback}
              </div>
            )}
          </div>
        ) : null

      default:
        return null
    }
  }

  const renderModule = (module: Module) => (
    <div key={module.id} className="ml-6 mb-4">
      <div className="hierarchy-item border-primary-300">
        <h5 className="font-medium text-gray-800">{module.title}</h5>
        {module.description && (
          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
        )}
      </div>
      
      {module.module_contents
        .sort((a, b) => a.position - b.position)
        .map((content) => (
          <div key={content.id} className="ml-4 mt-2">
            {renderModuleContent(content)}
          </div>
        ))}
    </div>
  )

  const renderChapter = (chapter: Chapter) => (
    <div key={chapter.id} className="ml-4 mb-3">
      <div className="hierarchy-item border-primary-400">
        <h4 className="font-medium text-gray-800">{chapter.title}</h4>
        {chapter.description && (
          <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
        )}
      </div>
      
      {chapter.modules.map(renderModule)}
    </div>
  )

  const renderUnit = (unit: Unit) => (
    <div key={unit.id} className="ml-3 mb-2">
      <div className="hierarchy-item border-primary-500">
        <h3 className="font-medium text-gray-800">{unit.title}</h3>
        {unit.description && (
          <p className="text-sm text-gray-600 mt-1">{unit.description}</p>
        )}
      </div>
      
      {unit.chapters.map(renderChapter)}
    </div>
  )

  const renderSubject = (subject: Subject) => (
    <div key={subject.id} className="ml-2 mb-2">
      <div className="hierarchy-item border-primary-600">
        <h2 className="font-medium text-gray-800">{subject.title}</h2>
        {subject.description && (
          <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
        )}
      </div>
      
      {expandedSubjects.has(subject.id) && subject.units.map(renderUnit)}
    </div>
  )

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
        {course.duration && (
          <span className="text-sm text-gray-500">{course.duration}</span>
        )}
      </div>
      
      {course.description && (
        <p className="text-gray-600 mb-4">{course.description}</p>
      )}
      
      <div className="space-y-2">
        {course.subjects.map((subject) => (
          <div key={subject.id}>
            <button
              onClick={() => toggleSubject(subject.id)}
              className="w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{subject.title}</span>
                <span className="text-gray-400">
                  {expandedSubjects.has(subject.id) ? '▼' : '▶'}
                </span>
              </div>
            </button>
            {expandedSubjects.has(subject.id) && renderSubject(subject)}
          </div>
        ))}
      </div>
    </div>
  )
}
