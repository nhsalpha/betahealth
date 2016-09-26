const path = require('path');
const mock = require('mock-fs');

const contentApi = require(`${rootFolder}/lib/content-api`);

describe('content api library', () => {
  afterEach(() => {
    mock.restore();
  });

  describe('#getRecord', () => {
    describe('when a file exists', () => {
      const slug = 'path/to/real/dir';
      const mockData = {
        title: 'foo',
        top: '!file=markdown.md',
        main: [
          {
            content: '## Heading 2',
          },
          {
            content: {
              title: 'bar',
              content: [
                {
                  content: '### Heading 3',
                },
              ],
            },
          },
        ],
      };

      before(() => {
        mock({
          [path.resolve(__dirname, '../../../content', slug)]: {
            'manifest.json': JSON.stringify(mockData),
            'markdown.md': mockData.top,
          },
        });
      });

      it('should return a JavaScript object', () => {
        const getRecord = contentApi.getRecord(slug);
        return getRecord.should.deep.equal(mockData);
      });
    });

    describe('when a file does not exist', () => {
      const slug = 'path/to/fake/dir';

      before(() => {
        mock({
          [path.resolve(__dirname, '../../../content', slug)]: {/** empty directory */},
        });
      });

      it('should return false', () => {
        const getRecord = contentApi.getRecord(slug);
        return getRecord.should.equal(false);
      });
    });
  });
});
