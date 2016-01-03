import { createAction, handleActions } from 'redux-actions'
import fetch from 'isomorphic-fetch'
import books from '../data/books'
import versions from '../data/versions'
import _ from 'underscore'

// constants
export const REQUEST_VERSE = 'REQUEST_VERSE'
export const RECEIVE_VERSE = 'RECEIVE_VERSE'
export const MOVED_CHAPTER = 'MOVE_CHAPTER'

// actions
export const requestVerse = createAction(REQUEST_VERSE, (book = 'Gen', chapter = 1, version = 'av') => ({ activeVerse: { book, chapter, version } }))
export const receiveVerse = createAction(RECEIVE_VERSE, (book = 'Gen', chapter = 1, version = 'av', verses) => ({ activeVerse: { book, chapter, version, verses } }))
export const movedChapter = createAction(MOVED_CHAPTER, (direction = 'next') => ({ direction }))

export function moveChapter (book, chapter, version, direction) {
  return function (dispatch, getState) {
    dispatch(movedChapter(book, chapter, version, direction))
    const {activeVerse} = getState().verse
    dispatch(fetchVerse(activeVerse.book, activeVerse.chapter, activeVerse.version))
  }
}

export function fetchVerse (book, chapter, version) {
  return function (dispatch, getState) {
    dispatch(requestVerse(book, chapter, version))
    fetch(`${window.apiUrl}/${version}/${book}/${chapter}`)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveVerse(book, chapter, version, json))
      })
  }
}
export const actions = {
  requestVerse,
  receiveVerse,
  fetchVerse,
  moveChapter
}

// reducer
function getCurrentActiveVerse (state, payload) {
  let { book, chapter, version, verses } = payload.activeVerse
  let currentBook = _.findWhere(state.books, {value: book})
  let total = currentBook.total
  let currentVersion = _.findWhere(state.versions, {value: version})
  let lang = currentVersion.lang
  if (!verses) verses = state.activeVerse.verses
  const activeVerse = Object.assign({}, state.activeVerse, {book, chapter, version, lang, total, verses})
  return activeVerse
}

export default handleActions({
  [REQUEST_VERSE]: (state, { payload }) => Object.assign({}, state, { isFetching: true }),
  [RECEIVE_VERSE]: (state, { payload }) => {
    const activeVerse = getCurrentActiveVerse(state, payload)
    return Object.assign({}, state, {
      isFetching: false,
      activeVerse
    })
  },
  [MOVED_CHAPTER]: (state, { payload }) => {
    let { chapter, total } = state.activeVerse
    let newChapter = (payload.direction === 'next' ? chapter + 1 : chapter - 1)
    if (newChapter < 1) newChapter = 1
    if (newChapter > total) newChapter = total
    let activeVerse = Object.assign({}, state.activeVerse, {chapter: newChapter})
    return Object.assign({}, state, {
      activeVerse
    })
  }
}, {
  activeVerse: {
    book: 'Gen',
    chapter: 1,
    total: 50,
    version: 'net',
    lang: 'en',
    verses: []
  },
  books,
  versions,
  isFetching: false
})
