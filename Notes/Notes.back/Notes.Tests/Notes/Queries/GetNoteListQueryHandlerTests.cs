using AutoMapper;
using Notes.Application.Notes.Queries.GetNameList;
using Notes.Application.Notes.Queries.GetNoteDetails;
using Notes.Persistence;
using Notes.Tests.Common;
using Notes.Tests.Notes.Commands;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Notes.Tests.Notes.Queries
{
    [Collection("QueryCollection")]
    public class GetNoteListQueryHandlerTests
    {
        private readonly NotesDbContext Context;
        private readonly IMapper Mapper;

        public GetNoteListQueryHandlerTests(QueryTestFixture fixture)
        {
            Context = fixture.Context;
            Mapper = fixture.Mapper;
        }
        [Fact]
        public async void GetNoteListQueryHandler_Success()
        {
            //Arrange
            var handler = new GetNoteListQueryHandler(Context, Mapper);

            //Act
            var result = await handler.Handle(
                new GetNoteListQuery
                {
                    UserId = NotesContextFactory.UserBId
                }, CancellationToken.None);

            //Assert
            result.ShouldBeOfType<NoteListVm>();
            result.Notes.Count.ShouldBe(2);

        }
    }
}
