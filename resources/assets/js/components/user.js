import React from 'react'
import ReactDom from 'react-dom'

export default class User extends React.Component   {
    constructor()   {
        super();
        this.state = {
            data: [],
            url:'/api/users',
            pagination: []
        }
    }

    componentWillMount()    {
        this.fetchUsers()
    }

    fetchUsers(page_url)    {
        let $this = this
        page_url = page_url !== undefined ?  page_url : '/api/users'
        
        axios.get(page_url).then(response => {
        //axios.get($this.state.url).then(response => {
            $this.setState({
                data: response.data.data  
            })
            $this.makePagination(response.data)
        }).catch(error  => {
            console.log(error)
        })
    }

    nextPageUrlHandle() {
        this.fetchUsers(this.state.pagination.next_page_url)
    }
    prevPageUrlHandle() {
        this.fetchUsers(this.state.pagination.prev_page_url)
    }
    loadMore()  {
        this.setState({
            url: this.state.pagination.next_page_url
        })
        
        this.fetchUsers()
    }

    makePagination(data)    {
        let pagination = {
            current_page: data.current_page,
            last_page: data.last_page,
            next_page_url: data.next_page_url,
            prev_page_url: data.prev_page_url
        }

        this.setState({
            pagination: pagination
        })
    }

    render()    {
        return (
            <div>
                <h2>Users Listing</h2>
                <a href="/users/create" className="btn btn-primary mb-2">Add New User</a>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map((user, i)=> (
                            <UserRow key={i} i={i} user={user} object={this} />
                            )
                        )}
                    </tbody>
                </table>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item"><a className="page-link" href="javascript:;" onClick={this.prevPageUrlHandle.bind(this)}>Previous</a></li>
                        <li className="page-item disabled"><a className="page-link" href="#">{this.state.pagination.current_page} of {this.state.pagination.last_page}</a></li>
                        <li className="page-item"><a className="page-link" href="javascript:;" onClick={this.nextPageUrlHandle.bind(this)}>Next</a></li>
                    </ul>
                </nav>       
                <button className="btn btn-default" onClick={this.loadMore.bind(this)}>Load more results</button>
            </div>
        );
    }
}

class UserRow extends React.Component {
    deleteUser(user, object)   {
        console.log(user)          
        var $this = object
        console.log($this.state.data.slice())
        //remove data from database
        axios.delete('/api/users/'+ user.id).then(response => {
            console.log(response)

            //removing of data from html
            const newState = $this.state.data.slice();
            newState.splice(newState.indexOf(user), 1)
            $this.setState({
                data: newState
            })
        }).catch(error => {
            console.log(error)
        })
    }
    render() {
        return (
            <tr key={this.props.i}>
                <td>{this.props.user.id}</td>
                <td>{this.props.user.name}</td>
                <td>{this.props.user.email}</td>
                <td><a href={"/users/"+this.props.user.id+"/edit"} className="btn btn-primary">Edit</a> || <a href="javascript:;" className="btn btn-danger" onClick={this.deleteUser.bind(this, this.props.user,this.props.object)}>Delete</a></td>
            </tr>
        )
    }
}


if(document.getElementById('app'))  {
    ReactDom.render(<User/>, document.getElementById('app'))
}
