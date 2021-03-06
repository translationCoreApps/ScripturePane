/* eslint-env jest */
import fs from 'fs-extra';
import * as highlightHelpers from '../src/helpers/highlightHelpers';
import path from 'path';

const ult_project = path.join(__dirname, 'fixtures/ult/tit/1.json');
const ugnt_project = path.join(__dirname, 'fixtures/ugnt/tit/1.json');
const expectedNestedChildren = [
  {
    "text": "good",
    "tag": "w",
    "type": "word",
    "occurrence": 1,
    "occurrences": 1
  },
  {
    "text": "for",
    "tag": "w",
    "type": "word",
    "occurrence": 1,
    "occurrences": 1
  },
  {
    "text": "him",
    "tag": "w",
    "type": "word",
    "occurrence": 2,
    "occurrences": 2
  }
];
const deepNestedMilestone = [[expectedNestedChildren]];

// Tests for Verse React Component
describe('isWordArrayMatch',()=>{
  test('en ULT should match first Θεοῦ to "of God"', () => {
    //given
    const chapter = fs.readJSONSync(ult_project);
    const verse1 = chapter[1];
    const wordArray = [];
    flattenVerseObjects(verse1.verseObjects, wordArray);
    const contextID = {
      quote: "Θεοῦ",
      occurrence: 1
    };

    // when
    let matchWords = getMatches_isWordArrayMatch(wordArray, contextID);

    // then
    expect(matchWords.join(' ')).toEqual('of God');
  });

  test('en ULT should match 2nd Θεοῦ to "God\'s"', () => {
    //given
    const chapter = fs.readJSONSync(ult_project);
    const verse1 = chapter[1];
    const wordArray = [];
    flattenVerseObjects(verse1.verseObjects, wordArray);
    const contextID = {
      quote: "Θεοῦ",
      occurrence: 2
    };

    // when
    let matchWords = getMatches_isWordArrayMatch(wordArray, contextID);

    // then
    expect(matchWords.join("'")).toEqual("God's");
  });

  test('UGNT should match 1st Θεοῦ only', () => {
    //given
    const chapter = fs.readJSONSync(ugnt_project);
    const verse1 = chapter[1];
    const wordArray = [];
    flattenVerseObjects(verse1.verseObjects, wordArray);
    const contextID = {
      quote: "Θεοῦ",
      occurrence: 1
    };

    // when
    let matchIndices = getMatches_isWordMatch(wordArray, contextID);

    // then
    expect(matchIndices).toEqual([5]);
  });

  test('UGNT should match 2nd Θεοῦ only', () => {
    //given
    const chapter = fs.readJSONSync(ugnt_project);
    const verse1 = chapter[1];
    const wordArray = [];
    flattenVerseObjects(verse1.verseObjects, wordArray);
    const contextID = {
      quote: "Θεοῦ",
      occurrence: 2
    };

    // when
    let matchIndices = getMatches_isWordMatch(wordArray, contextID);

    // then
    expect(matchIndices).toEqual([15]);
  });
});

//
// helpers
//

function getMatches_isWordMatch(wordArray, contextID) {
  let matchIndices = [];
  wordArray.map((word, i) => {
    if (highlightHelpers.isWordMatch(word, contextID, wordArray, i)) {
      matchIndices.push(i);
    }
  });
  return matchIndices;
}

function getMatches_isWordArrayMatch(wordArray, contextID) {
  let matchWords = [];
  wordArray.map((word, i) => {
    if (highlightHelpers.isWordArrayMatch(word, contextID)) {
      matchWords.push(word.text);
    }
  });
  return matchWords;
}

/**
 * @description flatten verse objects from nested format to flat array
 * @param {array} verse - source array of nested verseObjects
 * @param {array} words - output array that will be filled with flattened verseObjects
 */
const flattenVerseObjects = (verse, words) => {
  for (let object of verse) {
    if (object) {
      if (object.type === 'word') {
        object.strong = object.strong || object.strongs;
        words.push(object);
      } else if (object.type === 'milestone') { // get children of milestone
        // add content attibute to children
        const newObject = addContentAttributeToChildren(object.children, object);
        flattenVerseObjects(newObject, words);
      } else {
        words.push(object);
      }
    }
  }
};

const addContentAttributeToChildren = (childrens, parentObject, grandParentContent) => {
  return childrens.map((child) => {
    if (child.children) {
      child = addContentAttributeToChildren(child.children, child, parentObject.content);
    } else if (!child.content && parentObject.content) {
      const childrenContent = [parentObject];
      if (grandParentContent) childrenContent.push(grandParentContent);
      child.content = childrenContent;
    }
    return child;
  });
};

describe('getDeepNestedWords', () => {
  test('Returns the nested children that contains the array of word objects', () => {
    const wordObjects = highlightHelpers.getDeepNestedWords(deepNestedMilestone);
    expect(wordObjects).toEqual(expectedNestedChildren);
  });
});

describe('isPunctuationHighlighted', () => {
  const content = [
    {
      content: "Θεοῦ",
      lemma: "θεός",
      morph: "Gr,N,,,,,GMS,",
      occurrence: 1,
      occurrences: 1,
      strong: "G23160",
      tag: "zaln",
      type: "milestone"
    },
    {
      content: "τοῦ",
      lemma: "ὁ",
      morph: "Gr,EA,,,,GMS,",
      occurrence: 1,
      occurrences: 1,
      strong: "G35880",
      tag: "zaln",
      type: "milestone"
    }
  ];
  const previousWord = {
    content: content,
    occurrence: 1,
    occurrences: 1,
    tag: "w",
    text: "God",
    type: "word"
  };
  const nextWord = {
    content: content,
    occurrence: 1,
    occurrences: 1,
    tag: "w",
    text: "s",
    type: "word"
  };
  const contextID = {
    groupId: "god",
    occurrence: 1,
    quote: "Θεοῦ"
  };

  test('Returns false with invalid argumnets', () => {
    const isPunctuationHighlighted = highlightHelpers.isPunctuationHighlighted(null, null, null);
    expect(isPunctuationHighlighted).toBeFalsy();
  });

  test('Returns true with valid argumnets', () => {
    const isPunctuationHighlighted = highlightHelpers.isPunctuationHighlighted(previousWord, nextWord, contextID);
    expect(isPunctuationHighlighted).toBeTruthy();
  });

  test('Returns true with only one define argument', () => {
    const isPunctuationHighlighted = highlightHelpers.isPunctuationHighlighted(previousWord, undefined, contextID);
    expect(isPunctuationHighlighted).toBeTruthy();
  });
});
