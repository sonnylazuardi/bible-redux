import { connect } from 'react-redux'
import { actions as verseActions } from '../redux/modules/verse'
import styles from './VerseView.scss'

const BookSelectView = ({item, lang}) => (
  <option value={item.value}>{lang === 'en' ? item.name : item.name_id}</option>
)

export class VerseView extends React.Component {
  static propTypes = {
    activeVerse: React.PropTypes.object.isRequired,
    isFetching: React.PropTypes.bool.isRequired,
    fetchVerse: React.PropTypes.func.isRequired,
    moveChapter: React.PropTypes.func.isRequired,
    books: React.PropTypes.array.isRequired,
    versions: React.PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      book: 'Gen',
      chapter: 1,
      version: 'net'
    }
  }

  componentDidMount () {
    this.fetchVerse()
  }

  fetchVerse () {
    setTimeout(() => {
      const { book, chapter, version } = this.state
      this.props.fetchVerse(book, chapter, version)
    })
  }

  onSubmit (e) {
    e.preventDefault()
    this.fetchVerse()
  }

  _generateVerses () {
    let verses = []
    for (var i = 1; i <= this.props.activeVerse.total; i++) {
      verses.push(<option key={i} value={i}>{i}</option>)
    }
    return verses
  }

  moveChapter (direction, e) {
    this.props.moveChapter(direction)
  }

  componentWillReceiveProps (nextProps) {
    const {book, chapter, version} = nextProps.activeVerse
    if (chapter !== this.state.chapter) {
      this.setState({chapter})
    }
    if (book !== this.state.book) {
      this.setState({book})
    }
    if (version !== this.state.version) {
      this.setState({version})
    }
  }

  render () {
    const verses = (this.props.activeVerse && this.props.activeVerse.verses) || []
    const activeLang = (this.props.activeVerse && this.props.activeVerse.lang)
    const { book, chapter, version } = this.state
    return (
      <div className={'container ' + styles['container']}>
        <div className={styles['header']}>
          <form onSubmit={this.onSubmit.bind(this)} className={styles['form-nav']}>
            <select value={book} onChange={(e) => { this.setState({book: e.target.value}); this.fetchVerse() }}>
              <optgroup label='Old Testament'>
                {this.props.books.filter(item => item.type === 'old').map((item, i) => (
                  <BookSelectView item={item} key={item.value} lang={activeLang} />
                ))}
              </optgroup>
              <optgroup label='New Testament'>
                {this.props.books.filter(item => item.type === 'new').map((item, i) => (
                  <BookSelectView item={item} key={item.value} lang={activeLang} />
                ))}
              </optgroup>
            </select>
            <select value={chapter} onChange={(e) => { this.setState({chapter: e.target.value}); this.fetchVerse() }}>
              {this._generateVerses()}
            </select>
            <select className={styles['version']} value={version} onChange={(e) => { this.setState({version: e.target.value}); this.fetchVerse() }}>
              <optgroup label='English'>
                {this.props.versions.filter(item => item.lang === 'en').map((item, i) => (
                  <option key={item.value} value={item.value}>{item.name}</option>
                ))}
              </optgroup>
              <optgroup label='Bahasa Indonesia'>
                {this.props.versions.filter(item => item.lang === 'id').map((item, i) => (
                  <option key={item.value} value={item.value}>{item.name}</option>
                ))}
              </optgroup>
            </select>
          </form>
        </div>
        <div className={styles['buttons']}>
          <button className={styles['left']} onClick={this.moveChapter.bind(this, 'prev')}>&lt;</button>
          <button className={styles['right']} onClick={this.moveChapter.bind(this, 'next')}>&gt;</button>
        </div>
        {this.props.isFetching
          ? <div className={styles['loading']}>Loading...</div>
          : null}
        <ul className={styles['verse-list']}>
          {verses.map((item, i) => (
            item.type === 'content'
            ? <li key={i}><span className={styles['verse-number']}>{item.verse}</span> {item.content}</li>
            : <li key={i}><h3>{item.content}</h3></li>
          ))}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { activeVerse, books, versions, isFetching } = state.verse
  return { activeVerse, books, versions, isFetching }
}

export default connect(mapStateToProps, verseActions)(VerseView)
